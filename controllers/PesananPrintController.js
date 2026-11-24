const PesananPrint = require('../models/PesananPrintModel');
const LayananPrint = require('../models/LayananPrintModel');
const { errorHttp } = require('../middlewares/errorHandler');

const FIELD_BOLEH_DIPILIH = ['kode_pesanan', 'nama_pelanggan', 'layanan', 'jumlah', 'status', 'createdAt'];

async function pastikanLayananAda(layananId) {
  const ada = await LayananPrint.exists({ _id: layananId });
  if (!ada) throw errorHttp(400, 'layanan tidak ditemukan');
}

exports.create = async (req, res) => {
  if (req.body.layanan) await pastikanLayananAda(req.body.layanan);
  const data = await PesananPrint.create(req.body);
  res.status(201).json(data);
};

// GET /?status=diproses&layanan=<id>&fields=kode_pesanan,nama_pelanggan
exports.getAll = async (req, res) => {
  // Hanya field yang diizinkan yang menjadi filter
  const filter = {};
  if (req.query.status) filter.status = String(req.query.status);
  if (req.query.layanan) filter.layanan = String(req.query.layanan);

  let select = '';
  if (req.query.fields) {
    const fields = String(req.query.fields).split(',').map((f) => f.trim());
    if (!fields.every((f) => FIELD_BOLEH_DIPILIH.includes(f))) {
      throw errorHttp(400, `fields hanya boleh: ${FIELD_BOLEH_DIPILIH.join(', ')}`);
    }
    select = fields.join(' ');
  }

  const query = PesananPrint.find(filter).select(select).sort({ createdAt: -1 });
  // populate hanya bila layanan ikut tampil
  if (!select || select.split(' ').includes('layanan')) {
    query.populate('layanan', 'nama harga_per_unit satuan');
  }

  const data = await query;
  res.json({ count: data.length, data });
};

exports.getById = async (req, res) => {
  const data = await PesananPrint.findById(req.params.id).populate('layanan');
  if (!data) throw errorHttp(404, 'Pesanan tidak ditemukan');
  res.json(data);
};

exports.update = async (req, res) => {
  if (req.body.layanan) await pastikanLayananAda(req.body.layanan);
  const data = await PesananPrint.findByIdAndUpdate(req.params.id, req.body, {
    returnDocument: 'after',
    runValidators: true,
  });
  if (!data) throw errorHttp(404, 'Pesanan tidak ditemukan');
  res.json(data);
};

exports.remove = async (req, res) => {
  const data = await PesananPrint.findByIdAndDelete(req.params.id);
  if (!data) throw errorHttp(404, 'Pesanan tidak ditemukan');
  res.status(204).send();
};
