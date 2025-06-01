const express = require('express');
const fetch = require('node-fetch');
const app = express();

// New FiveM data source
const CONNECTIONS_URL = 'http://15.204.218.219:30120/op-framework/connections.json';

// New route: return Rockstar licenses only
app.get('/connections', async (req, res) => {
  try {
    const response = await fetch(CONNECTIONS_URL);
    const data = await response.json();

    const licenses = data.map(player => {
      const licenseId = player.identifiers.find(id => id.startsWith('license:'));
      return licenseId ? licenseId.replace('license:', '') : null;
    }).filter(Boolean); // Remove nulls

    res.json({ licenses });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch licenses', detail: err.message });
  }
});

// Optional: keep old route if you still use it elsewhere
app.get('/players.json', async (req, res) => {
  try {
    const response = await fetch('http://15.204.218.219:30120/players.json');
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch players', detail: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
