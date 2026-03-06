const multer = require('multer');

// Usamos la memoria RAM (Buffer) en lugar del disco duro
const storage = multer.memoryStorage();

const uploadMiddleware = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // Mantenemos tu límite de 5MB
});

module.exports = uploadMiddleware;