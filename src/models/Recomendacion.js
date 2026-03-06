const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Recomendacion = sequelize.define('Recomendacion', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    // trabajador_id and autor_id will be added via relations
    comentario: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    puntuacion: {
        type: DataTypes.INTEGER,
        validate: {
            min: 1,
            max: 5,
        },
        allowNull: false,
    },
}, {
    tableName: 'recomendaciones',
    timestamps: true,
});

module.exports = Recomendacion;
