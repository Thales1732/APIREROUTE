const express = require('express');
const fetch = require('node-fetch');
const app = express();

// New FiveM data source
const CONNECTIONS_URL = 'http://15.204.218.219:30120/op-framework/connections.json';

// New route: return Rockstar licenses only
app.get('/connections', async (req, res) => {
  try {
    const response = await fetch(CONNECTIONS_URL);
    const text = await response.text(); // Get raw response
    console.log('RAW TEXT RESPONSE:\n', text); // Print raw response to logs

    let data;
    try {
      data = JSON.parse(text);
    } catch (jsonErr) {
      console.error('JSON parsing failed:', jsonErr);
      return res.status(500).json({ error: 'Invalid JSON from FiveM', detail: jsonErr.message, raw: text });
    }

    // Print parsed JSON structure
    console.log('PARSED JSON TYPE:', typeof data, Array.isArray(data) ? 'Array' : 'Object');
    console.log('Parsed keys (if object):', Object.keys(data));

    // Instead of assuming it's an array, handle as object if needed
    const players = Array.isArray(data) ? data : Object.values(data);

    const licenses = players.map(player => {
      if (!player.identifiers || !Array.isArray(player.identifiers)) return null;

      const licenseId = player.identifiers.find(id => id.startsWith('license:'));
      return licenseId ? licenseId.replace('license:', '') : null;
    }).filter(Boolean);

    res.json({ licenses });
  } catch (err) {
    console.error('Fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch licenses', detail: err.message });
  }
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
