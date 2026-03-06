const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth.routes'));
router.use('/vacantes', require('./vacantes.routes'));
router.use('/fichas', require('./fichas.routes'));
router.use('/recomendaciones', require('./recomendaciones.routes'));
router.use('/educativo', require('./educativo.routes'));
router.use('/admin', require('./admin.routes'));

module.exports = router;
