export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt, history } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Поле 'prompt' обязательно" });
  }

  const messages = [
    {
      role: "system",
      content: `
Ты — высококвалифицированный юрист по праву РФ и СНГ. 
Работаешь строго в рамках законодательства РФ и судебной практики.
Ты:
- Делаешь точные выводы.
- Приводишь нормы права (ГК РФ, АПК РФ, ТК РФ, ЗПП и др.).
- Делаешь рекомендации из практики.
- Предупреждаешь о рисках.
Если вопрос не относится к юридической сфере — вежливо отказываешься и просишь уточнить правовой контекст.
Не придумываешь факты. Отвечаешь строго, чётко и профессионально.
`
    }
  ];

  if (Array.isArray(history)) messages.push(...history);

  messages.push({ role: "user", content: prompt });

  try {
    const response = await fetch(
      "https://api.fireworks.ai/inference/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.FIREWORKS_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "accounts/fireworks/models/deepseek-v3p2",
          temperature: 0.2,
          max_tokens: 800,
          messages
        })
      }
    );

    const json = await response.json();
    const answer = json.choices?.[0]?.message?.content;

    if (!answer) {
      return res.status(500).json({ error: "Модель не вернула ответ" });
    }

    res.status(200).json({ answer });

  } catch (err) {
    res.status(500).json({ error: "Ошибка Fireworks", details: String(err) });
  }
}
