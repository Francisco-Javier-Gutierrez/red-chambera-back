const { Vacante, User } = require('../models');
const { Op } = require('sequelize');

const getVacantes = async (req, res) => {
    try {
        const { page = 1, limit = 10, municipio, tipo_trabajo, horario } = req.query;
        const offset = (page - 1) * limit;

        const where = { activa: true };
        if (municipio) where.municipio = municipio;
        if (tipo_trabajo) where.tipo_trabajo = tipo_trabajo;
        if (horario) where.horario = horario;

        const { count, rows } = await Vacante.findAndCountAll({
            where,
            limit: parseInt(limit),
            offset: parseInt(offset),
            include: [
                {
                    model: User,
                    as: 'empleador',
                    attributes: { exclude: ['password'] }
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        const formattedRows = rows.map(r => {
            const json = r.toJSON();
            json.created_at = json.createdAt;
            if (json.empleador) {
                json.empleador.created_at = json.empleador.createdAt;
                delete json.empleador.createdAt;
                delete json.empleador.updatedAt;
            }
            delete json.createdAt;
            delete json.updatedAt;
            return json;
        });

        return res.json({
            data: formattedRows,
            total: count,
            page: parseInt(page),
            totalPages: Math.ceil(count / limit)
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al obtener vacantes' });
    }
};

const getVacanteById = async (req, res) => {
    try {
        const { id } = req.params;
        const vacante = await Vacante.findOne({
            where: { id, activa: true },
            include: [
                {
                    model: User,
                    as: 'empleador',
                    attributes: { exclude: ['password'] }
                }
            ]
        });

        if (!vacante) return res.status(404).json({ message: 'Vacante no encontrada' });

        const json = vacante.toJSON();
        json.created_at = json.createdAt;
        if (json.empleador) {
            json.empleador.created_at = json.empleador.createdAt;
            delete json.empleador.createdAt;
            delete json.empleador.updatedAt;
        }
        delete json.createdAt;
        delete json.updatedAt;

        return res.json(json);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
};

const getMisVacantes = async (req, res) => {
    try {
        const vacantes = await Vacante.findAll({
            where: { empleador_id: req.user.id },
            order: [['createdAt', 'DESC']]
        });
        const formatted = vacantes.map(v => {
            const json = v.toJSON();
            json.created_at = json.createdAt;
            delete json.createdAt;
            delete json.updatedAt;
            return json;
        });
        return res.json(formatted);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
};

const createVacante = async (req, res) => {
    try {
        const { titulo, descripcion, tipo_trabajo, municipio, horario, pago, requisitos, whatsapp_contacto } = req.body;

        const vacante = await Vacante.create({
            titulo,
            descripcion,
            tipo_trabajo,
            municipio,
            horario,
            pago,
            requisitos,
            whatsapp_contacto,
            empleador_id: req.user.id
        });

        const json = vacante.toJSON();
        json.created_at = json.createdAt;
        delete json.createdAt;
        delete json.updatedAt;

        return res.status(201).json(json);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al crear la vacante' });
    }
};

const updateVacante = async (req, res) => {
    try {
        const { id } = req.params;
        const vacante = await Vacante.findByPk(id);

        if (!vacante) return res.status(404).json({ message: 'Vacante no encontrada' });

        // Verificar permisos
        if (vacante.empleador_id !== req.user.id && req.user.rol !== 'admin') {
            return res.status(403).json({ message: 'No tienes permisos para modificar esta vacante' });
        }

        const { titulo, descripcion, tipo_trabajo, municipio, horario, pago, requisitos, whatsapp_contacto, activa } = req.body;

        await vacante.update({
            titulo: titulo !== undefined ? titulo : vacante.titulo,
            descripcion: descripcion !== undefined ? descripcion : vacante.descripcion,
            tipo_trabajo: tipo_trabajo !== undefined ? tipo_trabajo : vacante.tipo_trabajo,
            municipio: municipio !== undefined ? municipio : vacante.municipio,
            horario: horario !== undefined ? horario : vacante.horario,
            pago: pago !== undefined ? pago : vacante.pago,
            requisitos: requisitos !== undefined ? requisitos : vacante.requisitos,
            whatsapp_contacto: whatsapp_contacto !== undefined ? whatsapp_contacto : vacante.whatsapp_contacto,
            activa: activa !== undefined ? activa : vacante.activa
        });

        const json = vacante.toJSON();
        json.created_at = json.createdAt;
        delete json.createdAt;
        delete json.updatedAt;

        return res.json(json);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al actualizar la vacante' });
    }
};

const deleteVacante = async (req, res) => {
    try {
        const { id } = req.params;
        const vacante = await Vacante.findByPk(id);

        if (!vacante) return res.status(404).json({ message: 'Vacante no encontrada' });

        // Verificar permisos
        if (vacante.empleador_id !== req.user.id && req.user.rol !== 'admin') {
            return res.status(403).json({ message: 'No tienes permisos para eliminar esta vacante' });
        }

        await vacante.destroy();
        return res.status(204).send();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al eliminar la vacante' });
    }
};

module.exports = {
    getVacantes,
    getVacanteById,
    getMisVacantes,
    createVacante,
    updateVacante,
    deleteVacante
};
