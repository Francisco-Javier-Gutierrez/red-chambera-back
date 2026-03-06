require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const sequelize = require('./src/config/db');

// Import model relationships so they register before Sync
require('./src/models');

const app = express();

const corsOptions = {
    origin: 'http://localhost:5173', // En producción cambia esto a la URL de tu frontend (ej. 'http://localhost:5173')
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const apiRoutes = require('./src/routes');
app.use('/api', apiRoutes);

// Default route
app.get('/', (req, res) => {
    res.send('API is running...');
});

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('PostgreSQL conectado exitosamente.');

        // Remove force:true for production, using alter:true or nothing depending on the environment
        await sequelize.sync({ alter: true });
        console.log('Modelos sincronizados con la base de datos.');

        app.listen(PORT, () => {
            console.log(`Servidor ejecutándose en el puerto ${PORT}`);
        });
    } catch (error) {
        console.error('No se pudo conectar a la base de datos:', error);
    }
};

startServer();
