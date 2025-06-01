const express = require('express');
const fetch = require('node-fetch');
const app = express();

// Correct URL
const CONNECTIONS_URL = 'http://15.204.218.219:30120/op-framework/connections.json';

app.get('/connections', async (req, res) => {
  try {
    const response = await fetch(CONNECTIONS_URL);
    const jsonResponse = await response.json();

    // Expecting structure: { statusCode: 200, data: [...] }
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
    console.error('Fetch or parse error:', err);
    res.status(500).json({ error: 'Failed to fetch licenses', detail: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
