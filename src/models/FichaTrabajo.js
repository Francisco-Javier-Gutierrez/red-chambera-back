const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const FichaTrabajo = sequelize.define('FichaTrabajo', {
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
    fecha_realizacion: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    imagenes: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
        defaultValue: [],
    },
    // trabajador_id will be added by relations
}, {
    tableName: 'fichas_trabajo',
    timestamps: true,
});

module.exports = FichaTrabajo;
