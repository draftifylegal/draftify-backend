import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { Configuration, OpenAIApi } from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post('/api/generate-draft', async (req, res) => {
  const { doc_type, jurisdiction, parties, facts } = req.body;

  const prompt = `Generate a ${doc_type} under ${jurisdiction} law between ${parties}. Context: ${facts}`;

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
    });

    const draft = completion.data.choices[0].message.content;
    res.json({ draft });
  } catch (err) {
    console.error('Error generating draft:', err);
    res.status(500).send('OpenAI error');
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
