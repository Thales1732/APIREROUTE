const express = require('express');
const axios = require('axios');
const app = express();

// Target OP-FW URL
const TARGET_URL = 'http://15.204.218.219:30120/op-framework/connections.json';

// This proxy simply returns the exact data from OP-FW
app.get('/connections.json', async (req, res) => {
  try {
    const response = await axios.get(TARGET_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept': 'application/json',
        'Accept-Encoding': 'identity' // prevents compression issues
      }
    });

    // Return the exact raw data
    res.json(response.data);
  } catch (error) {
    console.error('Proxy fetch error:', error.message);
    res.status(500).json({ error: 'Failed to fetch data', detail: error.message });
  }
});

// ✅ Add this route for serverMetrics.json
app.get('/serverMetrics.json', async (req, res) => {
    try {
        const response = await fetch(`${FIVEM_SERVER_BASE}/serverMetrics.json`);
        const data = await response.json();
        res.json(data);
    } catch (err) {
        console.error('Error fetching serverMetrics.json:', err);
        res.status(500).json({ error: 'Failed to fetch serverMetrics.json' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
