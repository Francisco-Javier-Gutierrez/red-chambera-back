const express = require('express');
const router = express.Router();
const fichasController = require('../controllers/fichas.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
const uploadMiddleware = require('../middlewares/upload.middleware');

// Public routes
router.get('/', fichasController.getFichas);
router.get('/:id', fichasController.getFichaById);

// Protected routes
router.post('/', authMiddleware, roleMiddleware(['trabajador', 'admin']), uploadMiddleware.array('imagenes', 5), fichasController.createFicha);
router.delete('/:id', authMiddleware, fichasController.deleteFicha);

module.exports = router;
