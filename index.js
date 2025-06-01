import express from 'express';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 3000;

const BASE_URL = 'http://15.204.218.219:30120/op-framework';

app.get('/connections.json', async (req, res) => {
    try {
        const response = await fetch(`${BASE_URL}/connections.json`);
        const data = await response.json();
        res.json(data);
    } catch (err) {
        console.error('Error fetching connections.json:', err);
        res.status(500).json({ error: 'Failed to fetch connections.json' });
    }
});

app.get('/serverMetrics.json', async (req, res) => {
    try {
        const response = await fetch(`${BASE_URL}/serverMetrics.json`);
        const data = await response.json();
        res.json(data);
    } catch (err) {
        console.error('Error fetching serverMetrics.json:', err);
        res.status(500).json({ error: 'Failed to fetch servermetrics.json' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
