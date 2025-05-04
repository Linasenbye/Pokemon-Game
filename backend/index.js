const express = require('express');
const cors = require('cors');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const app = express();
const PORT = 3001;

app.use(cors());

app.get('/api/random-pokemon', async (req, res) => {
  try {
    const id = Math.floor(Math.random() * 151) + 1;
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);

    if (!response.ok) {
      throw new Error(`PokeAPI returned ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('Ошибка при получении покемона:', err.message);
    res.status(500).json({ error: 'Не удалось получить покемона' });
  }
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
