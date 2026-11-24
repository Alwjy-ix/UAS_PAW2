const mongoose = require('mongoose');

const pesananPrintSchema = new mongoose.Schema({
  kode_pesanan: { type: String, required: [true, 'Kode pesanan wajib diisi'], unique: true, trim: true },
  nama_pelanggan: { type: String, required: [true, 'Nama pelanggan wajib diisi'], trim: true },
  layanan: { type: mongoose.Schema.Types.ObjectId, ref: 'LayananPrint', required: [true, 'Layanan wajib diisi'] },
  jumlah: { type: Number, required: [true, 'Jumlah wajib diisi'], min: [1, 'Jumlah minimal 1'] },
  status: { type: String, enum: ['diterima', 'diproses', 'selesai', 'diambil'], default: 'diterima' }
}, { timestamps: true });

module.exports = mongoose.model('PesananPrint', pesananPrintSchema);