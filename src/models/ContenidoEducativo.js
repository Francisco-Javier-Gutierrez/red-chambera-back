const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ContenidoEducativo = sequelize.define('ContenidoEducativo', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    titulo: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    contenido: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    categoria: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    imagen: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    tableName: 'contenido_educativo',
    timestamps: true,
});

module.exports = ContenidoEducativo;
