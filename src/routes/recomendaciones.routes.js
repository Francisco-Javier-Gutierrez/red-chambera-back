const express = require('express');
const router = express.Router();
const recomendacionesController = require('../controllers/recomendaciones.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Public route filter by trabajador_id
router.get('/', recomendacionesController.getRecomendaciones);

// Protected route (Any logged in user can comment)
router.post('/', authMiddleware, recomendacionesController.createRecomendacion);

module.exports = router;
