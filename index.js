const express = require('express');
const fetch = require('node-fetch');
const app = express();

const FIVEM_SERVER_BASE = 'http://15.204.218.219:30120/op-framework';

app.get('/connections.json', async (req, res) => {
    try {
        const response = await fetch(`${FIVEM_SERVER_BASE}/connections.json`);
        const data = await response.json();
        res.json(data);
    } catch (err) {
        console.error('Error fetching connections.json:', err);
        res.status(500).json({ error: 'Failed to fetch connections.json' });
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
app.listen(PORT, () => console.log(`Proxy server running on port ${PORT}`));
