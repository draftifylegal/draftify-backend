const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 10000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// OpenAI setup
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Route
app.post('/api/generate-draft', async (req, res) => {
  const { doc_type, jurisdiction, parties, facts } = req.body;

  if (!doc_type || !jurisdiction || !parties || !facts) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  const prompt = `
You are a legal expert. Generate a formal legal draft based on:
Document Type: ${doc_type}
Jurisdiction: ${jurisdiction}
Parties: ${parties}
Facts: ${facts}

Write it in legal drafting style with appropriate formatting.
`;

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    const draft = completion.data.choices[0]?.message?.content || '';
    res.json({ draft });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Error generating draft' });
  }
});

app.listen(port, () => {
  console.log(`✅ Draftify backend running on port ${port}`);
});