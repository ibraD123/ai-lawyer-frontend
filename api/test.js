export default async function handler(req, res) {
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
          messages: [
            { role: "user", content: "Кратко: что такое договор поставки?" }
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
