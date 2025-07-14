import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { OpenAI } from "openai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 10000;

app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/api/generate-draft", async (req, res) => {
  const { type, jurisdiction, parties, facts } = req.body;

  if (!type || !jurisdiction || !facts) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  const prompt = `
You are a legal expert. Generate a formal legal draft based on:
Document Type: ${type}
Jurisdiction: ${jurisdiction}
Parties: ${parties || "Not specified"}
Facts: ${facts}

Write it in legal drafting style with appropriate formatting.
  `;

  try {
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    const draft = chatCompletion.choices[0]?.message?.content || "No draft generated.";
    res.json({ draft });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate draft." });
  }
});

app.listen(port, () => {
  console.log(`✅ Draftify backend running on port ${port}`);
});