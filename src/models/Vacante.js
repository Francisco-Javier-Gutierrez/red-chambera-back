const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Vacante = sequelize.define('Vacante', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    titulo: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    tipo_trabajo: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    municipio: {
        type: DataTypes.STRING,
        defaultValue: 'Tejupilco de Hidalgo',
        allowNull: false,
    },
    horario: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    pago: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    requisitos: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    whatsapp_contacto: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    activa: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    tipo_registro: {
        type: DataTypes.ENUM('vacante', 'trabajador'),
        defaultValue: 'vacante',
        allowNull: false,
    },
    // empleador_id will be added by relations
}, {
    tableName: 'vacantes',
    timestamps: true,
});

module.exports = Vacante;
