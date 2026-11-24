const router = require('express').Router();
const c = require('../controllers/PesananPrintController');

router.post('/', c.create);
router.get('/', c.getAll);
router.get('/:id', c.getById);

module.exports = router;