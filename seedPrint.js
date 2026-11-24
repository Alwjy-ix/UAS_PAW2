// seedPrint.js
// Mengisi basis data dengan data contoh jasa print: 3 user, 8 layanan, 12 pesanan.
// Pesanan memakai referencing (layanan) dan embedding (kontak). Butuh PesananPrintModel.js versi ber-kontak.
// Pemakaian: node seedPrint.js
//
// PERHATIAN: koleksi layananprints dan pesananprints DIKOSONGKAN dulu, lalu diisi ulang.
// Untuk users, hanya tiga akun contoh di bawah yang dihapus dan dibuat ulang;
// akun lain yang pernah register tidak disentuh.
require('dotenv').config({ quiet: true });
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/userModel');
const LayananPrint = require('./models/LayananPrintModel');
const PesananPrint = require('./models/PesananPrintModel');

const USERS = [
  { username: 'admin', password: 'Admin12345', role: 'admin' },
  { username: 'budi', password: 'User12345', role: 'user' },
  { username: 'siti', password: 'User12345', role: 'user' },
];

const LAYANAN = [
  { nama: 'Print A4 Hitam Putih', harga_per_unit: 500, satuan: 'lembar' },
  { nama: 'Print A4 Warna', harga_per_unit: 1500, satuan: 'lembar' },
  { nama: 'Print A3 Warna', harga_per_unit: 4000, satuan: 'lembar' },
  { nama: 'Fotokopi A4', harga_per_unit: 300, satuan: 'lembar' },
  { nama: 'Jilid Spiral', harga_per_unit: 7000, satuan: 'pcs' },
  { nama: 'Laminating A4', harga_per_unit: 5000, satuan: 'lembar' },
  { nama: 'Cetak Foto 4R', harga_per_unit: 2500, satuan: 'lembar' },
  { nama: 'Cetak Banner', harga_per_unit: 35000, satuan: 'meter' },
];

// layanan = nama layanan (diubah jadi ObjectId saat seed), kontak = sub-dokumen yang ditanam.
// Sengaja bervariasi: ada yang kontaknya lengkap, hanya no_hp, atau tanpa kontak (kontak bersifat opsional).
const PESANAN = [
  { kode_pesanan: 'PSN-001', nama_pelanggan: 'Andi Saputra', layanan: 'Print A4 Hitam Putih', jumlah: 40, status: 'selesai',
    kontak: { no_hp: '081200000001', email: 'andi@example.com' } },
  { kode_pesanan: 'PSN-002', nama_pelanggan: 'Bella Anjani', layanan: 'Print A4 Warna', jumlah: 15, status: 'diambil',
    kontak: { no_hp: '081200000002', email: 'bella@example.com' } },
  { kode_pesanan: 'PSN-003', nama_pelanggan: 'Candra Wijaya', layanan: 'Fotokopi A4', jumlah: 120, status: 'diproses',
    kontak: { no_hp: '081200000003' } },
  { kode_pesanan: 'PSN-004', nama_pelanggan: 'Dina Marlina', layanan: 'Jilid Spiral', jumlah: 3, status: 'diterima',
    kontak: { no_hp: '081200000004', email: 'dina@example.com' } },
  { kode_pesanan: 'PSN-005', nama_pelanggan: 'Eko Prasetyo', layanan: 'Cetak Banner', jumlah: 2, status: 'diproses',
    kontak: { no_hp: '081200000005', email: 'eko@example.com' } },
  { kode_pesanan: 'PSN-006', nama_pelanggan: 'Fani Lestari', layanan: 'Cetak Foto 4R', jumlah: 24, status: 'selesai',
    kontak: { no_hp: '081200000006', email: 'fani@example.com' } },
  { kode_pesanan: 'PSN-007', nama_pelanggan: 'Gilang Ramadhan', layanan: 'Laminating A4', jumlah: 10, status: 'diterima',
    kontak: { no_hp: '081200000007' } },
  { kode_pesanan: 'PSN-008', nama_pelanggan: 'Hana Putri', layanan: 'Print A3 Warna', jumlah: 6, status: 'diambil',
    kontak: { no_hp: '081200000008', email: 'hana@example.com' } },
  { kode_pesanan: 'PSN-009', nama_pelanggan: 'Irfan Hakim', layanan: 'Print A4 Hitam Putih', jumlah: 85, status: 'diproses',
    kontak: { no_hp: '081200000009', email: 'irfan@example.com' } },
  { kode_pesanan: 'PSN-010', nama_pelanggan: 'Julia Permata', layanan: 'Print A4 Warna', jumlah: 30, status: 'diterima',
    kontak: { no_hp: '081200000010', email: 'julia@example.com' } },
  { kode_pesanan: 'PSN-011', nama_pelanggan: 'Kevin Aditya', layanan: 'Fotokopi A4', jumlah: 60, status: 'selesai' },
  { kode_pesanan: 'PSN-012', nama_pelanggan: 'Lestari Dewi', layanan: 'Jilid Spiral', jumlah: 5, status: 'diambil',
    kontak: { no_hp: '081200000012', email: 'lestari@example.com' } },
];

async function main() {
  await mongoose.connect(process.env.DB_URI);

  // Dihapus dulu supaya aman dijalankan berulang
  await PesananPrint.deleteMany({});
  await LayananPrint.deleteMany({});
  await User.deleteMany({ username: { $in: USERS.map((u) => u.username) } });

  const users = await User.insertMany(
    await Promise.all(USERS.map(async (u) => ({
      username: u.username,
      password: await bcrypt.hash(u.password, 10),
      role: u.role,
    })))
  );

  const layanan = await LayananPrint.insertMany(LAYANAN);
  const idLayanan = Object.fromEntries(layanan.map((l) => [l.nama, l._id]));

  const pesanan = await PesananPrint.insertMany(
    PESANAN.map((p) => ({ ...p, layanan: idLayanan[p.layanan] }))
  );

  console.log(`Seed selesai: ${users.length} user, ${layanan.length} layanan, ${pesanan.length} pesanan`);
  console.log('Akun contoh: admin / Admin12345 (admin), budi / User12345 (user), siti / User12345 (user)');
  await mongoose.disconnect();
}

if (require.main === module) {
  main().catch((err) => { console.error(err.message); process.exit(1); });
}

module.exports = { USERS, LAYANAN, PESANAN };
