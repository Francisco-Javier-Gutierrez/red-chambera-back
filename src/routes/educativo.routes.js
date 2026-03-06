const express = require('express');
const router = express.Router();
const educativoController = require('../controllers/educativo.controller');

// Public routes
router.get('/', educativoController.getContenidos);
router.get('/:id', educativoController.getContenidoById);

module.exports = router;
