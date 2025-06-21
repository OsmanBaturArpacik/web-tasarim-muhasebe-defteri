const express = require('express');
const cors = require('cors');  // <-- ekle
const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');

const app = express();
app.use(cors());
//app.use(cors({
//    origin: 'http://localhost:63342'  // sadece bu adrese izin ver
//}));
app.use(express.json());

// Frontend dosyalarının konumu (public klasörü)
app.use(express.static(path.join(__dirname, 'public')));

// DATA_PATH
const DATA_PATH = path.resolve(__dirname, '../../data');

app.get('/transactions', (req, res) => {
    try {
        const csv = fs.readFileSync(path.join(DATA_PATH, 'transactions.csv'), 'utf-8');
        const data = Papa.parse(csv, { header: true }).data;
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Dosya okunamadı' });
    }
});

app.post('/transactions', (req, res) => {
    try {
        const newTx = req.body;
        const csvFile = path.join(DATA_PATH, 'transactions.csv');
        const csvText = fs.readFileSync(csvFile, 'utf-8');
        const parsed = Papa.parse(csvText, { header: true });

        newTx.id = String(Date.now());
        parsed.data.push(newTx);

        const newCsv = Papa.unparse(parsed.data);
        fs.writeFileSync(csvFile, newCsv);

        res.json({ success: true, transaction: newTx });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Dosya yazılamadı' });
    }
});

app.put('/transactions/:id', (req, res) => {
    const id = req.params.id;
    const updatedData = req.body;

    const csvFile = path.join(DATA_PATH, 'transactions.csv');
    const csvText = fs.readFileSync(csvFile, 'utf-8');
    const parsed = Papa.parse(csvText, { header: true });
    const newData = parsed.data.map(t => t.id === id ? { ...t, ...updatedData } : t);

    const newCsv = Papa.unparse(newData);
    fs.writeFileSync(csvFile, newCsv);

    res.json({ success: true });
});


app.delete('/transactions/:id', (req, res) => {
    try {
        const id = req.params.id;
        const csvFile = path.join(DATA_PATH, 'transactions.csv');
        const csvText = fs.readFileSync(csvFile, 'utf-8');
        const parsed = Papa.parse(csvText, { header: true });
        const filtered = parsed.data.filter(t => t.id !== id);
        const newCsv = Papa.unparse(filtered);
        fs.writeFileSync(csvFile, newCsv);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Dosya silinemedi' });
    }
});

// Categories endpointleri

app.get('/categories', (req, res) => {
    try {
        const csv = fs.readFileSync(path.join(DATA_PATH, 'categories.csv'), 'utf-8');
        const data = Papa.parse(csv, { header: true }).data;
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Kategori dosyası okunamadı' });
    }
});

app.post('/categories', (req, res) => {
    try {
        const newCat = req.body;
        const csvFile = path.join(DATA_PATH, 'categories.csv');
        const csvText = fs.readFileSync(csvFile, 'utf-8');
        const parsed = Papa.parse(csvText, { header: true });

        // Kullanıcı ve isim bazında kontrol
        const exists = parsed.data.some(
            c => c.user_id === newCat.user_id && c.name.trim().toLowerCase() === newCat.name.trim().toLowerCase()
        );
        if (exists) {
            return res.status(409).json({ error: 'Kategori zaten mevcut' });
        }

        newCat.id = String(Date.now()); // ID belirle
        parsed.data.push(newCat);

        const newCsv = Papa.unparse(parsed.data);
        fs.writeFileSync(csvFile, newCsv);

        res.json({ success: true, category: newCat });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Dosya yazılamadı' });
    }
});


app.delete('/categories/:id', (req, res) => {
    try {
        const id = req.params.id;
        const csvFile = path.join(DATA_PATH, 'categories.csv');
        const csvText = fs.readFileSync(csvFile, 'utf-8');
        const parsed = Papa.parse(csvText, { header: true });
        const filtered = parsed.data.filter(c => c.id !== id);
        const newCsv = Papa.unparse(filtered);
        fs.writeFileSync(csvFile, newCsv);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Kategori dosyasından silinemedi' });
    }
});

app.listen(3000, () => console.log('Server 3000 portta çalışıyor.'));