require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const logger = require('./middlewares/logger');
const { notFoundHandler, errorHandler } = require('./middlewares/errorHandler');

const authRoutes = require('./routes/authRoutes');
const layananPrintRoute = require('./routes/LayananPrintRoute');
const pesananPrintRoute = require('./routes/PesananPrintRoute');

if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET belum diisi di .env');
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 3000;

app.use(logger);
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
app.use(express.json());

// Express 5: req.body bernilai undefined bila request tidak membawa body JSON
app.use((req, res, next) => {
  req.body ??= {};
  next();
});

app.get('/', (req, res) => {
  res.json({ message: 'API Jasa Print berjalan' });
});

app.use('/api/auth', authRoutes);
app.use('/api/layanan-print', layananPrintRoute);
app.use('/api/pesanan-print', pesananPrintRoute);

// Urutan penting: 404 dulu, penangkap galat paling akhir
app.use(notFoundHandler);
app.use(errorHandler);

mongoose
  .connect(process.env.DB_URI)
  .then(() => {
    console.log('Terhubung ke MongoDB');
    app.listen(PORT, () => console.log(`Server berjalan di port ${PORT}`));
  })
  .catch((err) => {
    console.error('Gagal terhubung ke MongoDB:', err.message);
    process.exit(1);
  });

module.exports = app;
