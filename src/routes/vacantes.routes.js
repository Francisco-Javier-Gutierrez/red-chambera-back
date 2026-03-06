const express = require('express');
const router = express.Router();
const vacantesController = require('../controllers/vacantes.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

router.get('/', vacantesController.getVacantes);

router.get('/mis-vacantes', authMiddleware, roleMiddleware(['empleador', 'admin']), vacantesController.getMisVacantes);
router.get('/:id', vacantesController.getVacanteById);

router.post('/', authMiddleware, roleMiddleware(['empleador', 'admin']), vacantesController.createVacante);
router.put('/:id', authMiddleware, vacantesController.updateVacante);
router.delete('/:id', authMiddleware, vacantesController.deleteVacante);

module.exports = router;
