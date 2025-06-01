const express = require('express');
const axios = require('axios');
const app = express();

// Target OP-FW URL
const CONNECTIONS_URL = 'http://15.204.218.219:30120/op-framework/connections.json';

app.get('/connections', async (req, res) => {
  try {
    const response = await axios.get(CONNECTIONS_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Accept': 'application/json',
        'Accept-Encoding': 'identity' // Prevent gzip compression (sometimes fails on API)
      }
    });

    const jsonResponse = response.data;

    // Validate expected format
    if (!jsonResponse || !Array.isArray(jsonResponse.data)) {
      console.error('Unexpected structure:', jsonResponse);
      return res.status(500).json({ error: 'Invalid response structure', raw: jsonResponse });
    }

    const licenses = jsonResponse.data.map(player => {
      if (!player.licenseIdentifier || typeof player.licenseIdentifier !== 'string') return null;

      return player.licenseIdentifier.replace(/^license:/, '');
    }).filter(Boolean);

    res.json({ licenses });
  } catch (err) {
    console.error('Error fetching or processing data:', err.message);
    res.status(500).json({ error: 'Failed to fetch licenses', detail: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
