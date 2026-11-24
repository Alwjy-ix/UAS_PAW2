const PesananPrint = require('../models/PesananPrintModel');

exports.create = async (req, res) => {
  try {
    const data = await PesananPrint.create(req.body);
    res.status(201).json({ success: true, data });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ success: false, message: 'Kode pesanan sudah dipakai' });
    }
    res.status(400).json({ success: false, message: err.message });
  }
};

// GET /?status=diproses&layanan=<id>&fields=kode_pesanan,nama_pelanggan
exports.getAll = async (req, res) => {
  try {
    const { fields, ...filter } = req.query;
    const projection = fields ? fields.split(',').join(' ') : '';
    const data = await PesananPrint.find(filter).select(projection).populate('layanan', 'nama harga_per_unit');
    res.json({ success: true, count: data.length, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const data = await PesananPrint.findById(req.params.id).populate('layanan');
    if (!data) return res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan' });
    res.json({ success: true, data });
  } catch (err) {
    res.status(400).json({ success: false, message: 'ID tidak valid' });
  }
};