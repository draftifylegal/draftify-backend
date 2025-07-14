// server.js
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const app = express();
const port = process.env.PORT || 10000;

app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post('/api/generate-draft', async (req, res) => {
  try {
    const { doc_type, jurisdiction, parties, facts } = req.body;

    const prompt = `Generate a professional legal draft for a ${doc_type} under ${jurisdiction} jurisdiction involving the parties: ${parties}. Background: ${facts}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }]
    });

    const draftText = completion.choices[0].message.content;
    res.json({ draft: draftText });
  } catch (error) {
    console.error('Error generating draft:', error.message);
    res.status(500).json({ error: 'Failed to generate draft' });
  }
});

app.get('/', (req, res) => {
  res.send('Draftify Legal Backend is Running');
});

app.listen(port, () => {
  console.log(`✅ Draftify backend running on port ${port}`);
});