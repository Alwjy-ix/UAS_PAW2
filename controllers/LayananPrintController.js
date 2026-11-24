const LayananPrint = require('../models/LayananPrintModel');

exports.create = async (req, res) => {
  try {
    const data = await LayananPrint.create(req.body);
    res.status(201).json({ success: true, data });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const data = await LayananPrint.find();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};