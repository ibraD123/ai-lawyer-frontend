export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { text, preset, custom } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Поле 'text' обязательно" });
  }

  const presetPrompt = {
    "summary": "Сделай краткое структурированное резюме документа: цель, стороны, предмет, сроки, ключевые условия, суммы, вывод.",
    "risks": "Найди юридические риски, односторонние условия, скрытые обязанности и штрафы.",
    "requisites": "Извлеки реквизиты: стороны, даты, суммы, сроки, штрафы, специфические параметры договора."
  }[preset] || "";

  const finalPrompt = `
Документ:
${text}

Требуемый режим анализа: ${preset}

${presetPrompt}

Дополнительные указания: ${custom || "Нет"}
`;

  try {
    const response = await fetch(
      "https://api.fireworks.ai/inference/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.FIREWORKS_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "accounts/fireworks/models/deepseek-v3p2",
          temperature: 0.2,
          max_tokens: 1200,
          messages: [
            {
              role: "system",
              content: `
Ты — эксперт по договорному праву РФ.
Ты анализируешь документы и выделяешь структуру, риски, реквизиты.
Отвечай строго, не придумывай фактов. Делай выводы и рекомендации.
`
            },
            { role: "user", content: finalPrompt }
          ]
        })
      }
    );

    const json = await response.json();
    res.status(200).json({ output: json.choices?.[0]?.message?.content || "(пусто)" });

  } catch (err) {
    res.status(500).json({ error: "Ошибка Fireworks", details: String(err) });
  }
}
