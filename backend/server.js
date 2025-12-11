import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const FIREWORKS_API_KEY = process.env.FIREWORKS_API_KEY;

app.post("/api/test", async (req, res) => {
  try {
    const response = await fetch("https://api.fireworks.ai/inference/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${FIREWORKS_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "accounts/fireworks/models/deepseek-v3-32b",
        messages: [
          { role: "user", content: "Привет! Ты работаешь?" }
        ]
      })
    });

    const json = await response.json();

    res.json({ output: json.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ error: "Fireworks API error", details: String(err) });
  }
});

app.listen(3001, () => console.log("Backend running on http://localhost:3001"));
