const express = require('express');
const router = express.Router();
const vacantesController = require('../controllers/vacantes.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

// Public routes
router.get('/', vacantesController.getVacantes);

// 'mis-vacantes' must go before /:id to avoid confusing 'mis-vacantes' as an ID param
router.get('/mis-vacantes', authMiddleware, roleMiddleware(['empleador', 'admin']), vacantesController.getMisVacantes);
router.get('/:id', vacantesController.getVacanteById);

// Protected routes (Create, Update, Delete)
router.post('/', authMiddleware, roleMiddleware(['empleador', 'admin']), vacantesController.createVacante);
router.put('/:id', authMiddleware, vacantesController.updateVacante); // Inside checks if owner || admin
router.delete('/:id', authMiddleware, vacantesController.deleteVacante); // Inside checks if owner || admin

module.exports = router;
