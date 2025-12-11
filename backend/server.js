import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Разрешаем запросы с фронта (локально и при деплое можно добавить домен Vercel)
app.use(
  cors({
    origin: "*", // для MVP можно так; позже сузим под конкретные домены
  })
);

app.use(express.json());

const FIREWORKS_API_KEY = process.env.FIREWORKS_API_KEY;

const DEEPSEEK_MODEL = "accounts/fireworks/models/deepseek-v3-32b";
const LLAMA_MODEL = "accounts/fireworks/models/llama-v3p1-405b-instruct";

if (!FIREWORKS_API_KEY) {
  console.error("❌ FIREWORKS_API_KEY отсутствует в .env");
  process.exit(1);
}

// Общая функция вызова Fireworks Chat Completions
async function callFireworksChat(model, messages, extra = {}) {
  const response = await fetch(
    "https://api.fireworks.ai/inference/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${FIREWORKS_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages,
        ...extra,
      }),
    }
  );

  const json = await response.json();

  if (!response.ok) {
    console.error("Fireworks error:", json);
    throw new Error(
      json?.error?.message || json?.message || "Fireworks API error"
    );
  }

  const content = json?.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("Пустой ответ модели");
  }

  return content;
}

// -----------------------------
// TEST endpoint (для проверки ключа)
// -----------------------------
app.post("/api/test", async (req, res) => {
  try {
    const text =
      "Кратко объясни, что такое договор поставки в праве РФ (2–3 предложения).";

    const answer = await callFireworksChat(DEEPSEEK_MODEL, [
      {
        role: "system",
        content:
          "Ты опытный российский юрист. Отвечай коротко, деловым языком, строго в рамках права РФ.",
      },
      {
        role: "user",
        content: text,
      },
    ]);

    return res.json({ output: answer });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Fireworks API error",
      details: String(err),
    });
  }
});

// -----------------------------
// /api/consult — чат-консультант (DeepSeek)
// -----------------------------
app.post("/api/consult", async (req, res) => {
  try {
    const { messages } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res
        .status(400)
        .json({ error: "Поле 'messages' (массив) обязательно" });
    }

    // messages приходит из фронта (user/assistant), здесь добавляем мощный системный промпт
    const systemMessage = {
      role: "system",
      content:
        "Ты высококлассный юрист по праву РФ и стран СНГ. " +
        "Глубоко разбираешься в гражданском, договорном, корпоративном праве, трудовом праве и арбитражных спорах. " +
        "Отвечай строго в юридическом контексте, с ориентацией прежде всего на право РФ. " +
        "Если уместно, указывай статьи ГК РФ, ТК РФ, АПК РФ и других ключевых актов. " +
        "Если вопрос не относится к юриспруденции (например, про здоровье, психологию, личные отношения, ИТ без правового аспекта и т.п.), " +
        "вежливо отказывайся и проси задать юридический вопрос или описать правовую ситуацию. " +
        "Отвечай структурированно, по пунктам, деловым языком, без художественных отступлений. " +
        "Не выдавай себя за адвоката и не создавай впечатление гарантированного исхода спора — подчеркивай, что это консультация ИИ и не заменяет очного юриста.",
    };

    const fwMessages = [systemMessage, ...messages];

    const answer = await callFireworksChat(DEEPSEEK_MODEL, fwMessages, {
      temperature: 0.2,
      max_tokens: 900,
    });

    return res.json({ answer });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Ошибка вызова /api/consult",
      details: String(err),
    });
  }
});

// -----------------------------
// /api/generate — генерация документов (LLaMA)
// -----------------------------
app.post("/api/generate", async (req, res) => {
  try {
    const { toolId, toolName, prompt } = req.body;

    if (!toolId || !toolName) {
      return res.status(400).json({
        error: "Поля 'toolId' и 'toolName' обязательны",
      });
    }

    const userPrompt = (prompt || "").trim();

    const systemMessage = {
      role: "system",
      content:
        "Ты опытный российский юрист-договорник. " +
        "Твоя задача — готовить аккуратные юридические черновики документов для бизнеса в РФ и СНГ. " +
        "Строго соблюдай структуру деловых документов, используй нейтральный официальный стиль. " +
        "Не давай комментариев от первого лица, не вставляй пояснения вне текста документа. " +
        "Старайся избегать заведомо незаконных или заведомо невыполнимых условий. " +
        "Если данных пользователя мало, заполняй нейтральными формулировками и явно указывай, какие блоки потребуют уточнения. " +
        "Всегда пиши на русском языке.",
    };

    const userMessage = {
      role: "user",
      content:
        `Нужно подготовить черновик документа типа: "${toolName}" (toolId: ${toolId}).\n\n` +
        (userPrompt
          ? `Исходные данные от пользователя:\n${userPrompt}\n\n`
          : "Пользователь указал минимальные данные. Сформируй типовой, но аккуратный черновик.\n\n") +
        "Сформируй полный текст документа, без вводных комментариев и без пояснений после текста.",
    };

    const draft = await callFireworksChat(LLAMA_MODEL, [systemMessage, userMessage], {
      temperature: 0.3,
      max_tokens: 2000,
    });

    return res.json({ draft });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Ошибка вызова /api/generate",
      details: String(err),
    });
  }
});

// -----------------------------
// /api/analyze — анализ документов (DeepSeek)
// -----------------------------
app.post("/api/analyze", async (req, res) => {
  try {
    const { text, preset, customPrompt } = req.body;

    if (!text || !String(text).trim()) {
      return res.status(400).json({
        error: "Поле 'text' (текст документа) обязательно",
      });
    }

    const mode = preset || "Общий обзор документа";
    const extra = (customPrompt || "").trim();

    const systemMessage = {
      role: "system",
      content:
        "Ты высококлассный юрист по праву РФ и стран СНГ. " +
        "Специализируешься на анализе договоров, корпоративных документов, внутренних политик и процессуальных документов. " +
        "Отвечай строго в юридическом ключе, при необходимости ссылайся на право РФ. " +
        "Если документ явно не юридический, вежливо укажи, что он вне зоны компетенции, и попроси предоставить юридический текст. " +
        "Отвечай структурированно, с чёткими заголовками и пунктами, чтобы юристу было удобно дальше работать с выводами.",
    };

    const userMessage = {
      role: "user",
      content:
        `Вот текст документа (на русском языке):\n\n` +
        `${text}\n\n` +
        `Режим анализа: ${mode}.\n` +
        `Дополнительные указания пользователя: ${
          extra || "нет, используй стандартный подход для выбранного режима"
        }.\n\n` +
        "Сформируй ответ в следующей структуре:\n" +
        "1. Краткое резюме (3–7 пунктов)\n" +
        "2. Ключевые условия и конструкция договора\n" +
        "3. Выявленные риски и потенциально неблагоприятные формулировки\n" +
        "4. Рекомендации по доработке и смягчению рисков\n" +
        "5. На что обратить внимание клиенту (если документ подписывать в текущем виде).",
    };

    const analysis = await callFireworksChat(
      DEEPSEEK_MODEL,
      [systemMessage, userMessage],
      {
        temperature: 0.15,
        max_tokens: 1600,
      }
    );

    return res.json({ analysis });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Ошибка вызова /api/analyze",
      details: String(err),
    });
  }
});

// -----------------------------
// START SERVER
// -----------------------------
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
