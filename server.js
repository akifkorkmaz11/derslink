const express = require('express');
const cors = require('cors');
const path = require('path');
const Iyzipay = require('iyzipay');
const { createClient } = require('@supabase/supabase-js');

// Supabase client oluştur
const supabaseUrl = process.env.SUPABASE_URL || 'https://hmvhqrtuocytmtbwxuyx.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'your_key';
const supabase = createClient(supabaseUrl, supabaseKey);

const app = express();
const PORT = process.env.PORT || 3001;

// CORS ve middleware
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['https://your-vercel-domain.vercel.app'],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files serve - Yeni yapıya göre
app.use('/css', express.static(path.join(__dirname, 'public/css')));
app.use('/js', express.static(path.join(__dirname, 'public/js')));
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// HTML dosyaları için public klasörü
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/admin.html'));
});

app.get('/admin-lgs', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/admin-lgs.html'));
});

app.get('/admin-yks', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/admin-yks.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/dashboard.html'));
});

// ... geri kalan server.js kodları
