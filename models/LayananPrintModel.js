const mongoose = require('mongoose');

const layananPrintSchema = new mongoose.Schema({
  nama: { type: String, required: [true, 'Nama layanan wajib diisi'], unique: true, trim: true },
  harga_per_unit: { type: Number, required: [true, 'Harga wajib diisi'], min: 0 },
  satuan: { type: String, default: 'lembar' }
}, { timestamps: true });

module.exports = mongoose.model('LayananPrint', layananPrintSchema);