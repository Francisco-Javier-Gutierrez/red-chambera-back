const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

// Apply middleware to all routes in this router
router.use(authMiddleware);
router.use(roleMiddleware(['admin']));

router.get('/usuarios', adminController.getUsuarios);
router.put('/usuarios/:id', adminController.updateUsuario);
router.delete('/usuarios/:id', adminController.deleteUsuario);

router.get('/contenido', adminController.getContenidoMix);
router.delete('/contenido/:tipo/:id', adminController.deleteContenido);

router.get('/stats', adminController.getStats);

module.exports = router;
