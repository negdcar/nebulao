const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

app.post('/', async (req, res) => {
  const userMessage = req.body.userMessage;

  if (!userMessage) {
    return res.status(400).json({ error: 'Campo "userMessage" é obrigatório.' });
  }

  try {
    const openaiResponse = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: userMessage }],
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const reply = openaiResponse.data.choices[0].message.content;
    res.json({ reply });

  } catch (error) {
    console.error('Erro ao chamar o ChatGPT:', error.message);
    res.status(500).json({ error: 'Erro ao chamar o ChatGPT.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Nebulão está rodando na porta ${PORT}`));
