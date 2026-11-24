const LayananPrint = require('../models/LayananPrintModel');
const PesananPrint = require('../models/PesananPrintModel');
const { errorHttp } = require('../middlewares/errorHandler');

exports.create = async (req, res) => {
  const data = await LayananPrint.create(req.body);
  res.status(201).json(data);
};

exports.getAll = async (req, res) => {
  res.json(await LayananPrint.find());
};

exports.getById = async (req, res) => {
  const data = await LayananPrint.findById(req.params.id);
  if (!data) throw errorHttp(404, 'Layanan tidak ditemukan');
  res.json(data);
};

exports.update = async (req, res) => {
  const data = await LayananPrint.findByIdAndUpdate(req.params.id, req.body, {
    returnDocument: 'after',
    runValidators: true,
  });
  if (!data) throw errorHttp(404, 'Layanan tidak ditemukan');
  res.json(data);
};

exports.remove = async (req, res) => {
  // Layanan yang masih dipakai pesanan tidak boleh dihapus (cegah referensi yatim)
  const dipakai = await PesananPrint.exists({ layanan: req.params.id });
  if (dipakai) throw errorHttp(409, 'Layanan masih dipakai oleh pesanan, tidak bisa dihapus');

  const data = await LayananPrint.findByIdAndDelete(req.params.id);
  if (!data) throw errorHttp(404, 'Layanan tidak ditemukan');
  res.status(204).send();
};
