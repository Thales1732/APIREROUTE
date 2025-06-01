const express = require('express');
const fetch = require('node-fetch');
const app = express();

// OP-FW Connections Endpoint
const CONNECTIONS_URL = 'http://15.204.218.219:30120/op-framework/connections.json';

app.get('/connections', async (req, res) => {
  try {
    const response = await fetch(CONNECTIONS_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Accept': 'application/json'
      }
    });

    const jsonResponse = await response.json();

    // Expect structure: { statusCode: 200, data: [...] }
    if (!jsonResponse || !Array.isArray(jsonResponse.data)) {
      console.error('Unexpected structure:', jsonResponse);
      return res.status(500).json({ error: 'Invalid response structure', raw: jsonResponse });
    }

    const licenses = jsonResponse.data.map(player => {
      if (!player.licenseIdentifier || typeof player.licenseIdentifier !== 'string') return null;

      return player.licenseIdentifier.replace(/^license:/, '');
    }).filter(Boolean); // Remove nulls

    res.json({ licenses });
  } catch (err) {
    console.error('Fetch or parse error:', err);
    res.status(500).json({ error: 'Failed to fetch licenses', detail: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
