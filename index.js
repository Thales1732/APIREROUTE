const express = require('express');
const fetch = require('node-fetch');
const app = express();

const TARGET_URL = 'http://15.204.218.219:30120/players.json';

// Original route
app.get('/players', async (req, res) => {
  try {
    const response = await fetch(TARGET_URL);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch players', detail: err.message });
  }
});

// New route to match /players.json exactly
app.get('/players.json', async (req, res) => {
  try {
    const response = await fetch(TARGET_URL);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch players', detail: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
