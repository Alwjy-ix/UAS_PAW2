const router = require('express').Router();
const c = require('../controllers/LayananPrintController');
const verifyToken = require('../middlewares/verifyToken');

// Publik
router.get('/', c.getAll);
router.get('/:id', c.getById);

// Wajib login (JWT)
router.post('/', verifyToken, c.create);
router.put('/:id', verifyToken, c.update);
router.delete('/:id', verifyToken, c.remove);

module.exports = router;
