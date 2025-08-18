const express = require('express');
const cors = require('cors');

const app = express();

// CORS ve middleware
app.use(cors());
app.use(express.json());

// Test endpoint
app.get('/api/test', (req, res) => {
    res.json({ message: 'API Server çalışıyor!' });
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        message: 'API Health check başarılı'
    });
});

// Vercel için export
module.exports = app;