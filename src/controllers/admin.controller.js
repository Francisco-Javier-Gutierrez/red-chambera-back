const { User, Vacante, FichaTrabajo, Recomendacion, ContenidoEducativo } = require('../models');

const getUsuarios = async (req, res) => {
    try {
        const usuarios = await User.findAll({
            attributes: { exclude: ['password'] },
            order: [['createdAt', 'DESC']]
        });
        return res.json(usuarios.map(u => {
            const json = u.toJSON();
            json.created_at = json.createdAt;
            delete json.createdAt;
            delete json.updatedAt;
            return json;
        }));
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al obtener usuarios' });
    }
};

const updateUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);

        if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

        if (req.body.password) {
            const bcrypt = require('bcrypt');
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt);
        }

        await user.update(req.body);

        const userObj = user.toJSON();
        delete userObj.password;
        userObj.created_at = userObj.createdAt;
        delete userObj.createdAt;
        delete userObj.updatedAt;

        return res.json(userObj);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al actualizar usuario' });
    }
};

const deleteUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);

        if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

        // Eliminación manual en cascada para evitar problemas de FK constraints si falla la BD
        await Vacante.destroy({ where: { empleador_id: id } });
        await FichaTrabajo.destroy({ where: { trabajador_id: id } });
        await Recomendacion.destroy({ where: { trabajador_id: id } });
        await Recomendacion.destroy({ where: { autor_id: id } }); // Recomendaciones hechas por él

        await user.destroy();

        return res.status(204).send();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al eliminar usuario' });
    }
};

const getContenidoMix = async (req, res) => {
    try {
        const vacantes = await Vacante.findAll({
            include: [{ model: User, as: 'empleador', attributes: ['nombre', 'id'] }],
            order: [['createdAt', 'DESC']],
            limit: 50
        });

        const fichas = await FichaTrabajo.findAll({
            include: [{ model: User, as: 'trabajador', attributes: ['nombre', 'id'] }],
            order: [['createdAt', 'DESC']],
            limit: 50
        });

        // Añadir campo 'tipo' y mezclar
        const vacantesMod = vacantes.map(v => {
            const json = v.toJSON();
            json.created_at = json.createdAt;
            if (json.empleador) {
                json.empleador.created_at = json.empleador.createdAt;
                delete json.empleador.createdAt;
                delete json.empleador.updatedAt;
            }
            delete json.createdAt;
            delete json.updatedAt;
            return { ...json, tipo: 'vacante' };
        });

        const fichasMod = fichas.map(f => {
            const json = f.toJSON();
            json.created_at = json.createdAt;
            if (json.trabajador) {
                json.trabajador.created_at = json.trabajador.createdAt;
                delete json.trabajador.createdAt;
                delete json.trabajador.updatedAt;
            }
            delete json.createdAt;
            delete json.updatedAt;
            return { ...json, tipo: 'ficha' };
        });

        const mix = [...vacantesMod, ...fichasMod].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        return res.json(mix);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al obtener contenido' });
    }
};

const deleteContenido = async (req, res) => {
    try {
        const { tipo, id } = req.params;

        if (tipo === 'vacante') {
            const deleted = await Vacante.destroy({ where: { id } });
            if (!deleted) return res.status(404).json({ message: 'Vacante no encontrada' });
        } else if (tipo === 'ficha') {
            const deleted = await FichaTrabajo.destroy({ where: { id } });
            if (!deleted) return res.status(404).json({ message: 'Ficha de trabajo no encontrada' });
        } else {
            return res.status(400).json({ message: 'Tipo de contenido inválido' });
        }

        return res.status(204).send();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al eliminar contenido' });
    }
};

const getStats = async (req, res) => {
    try {
        const totalUsuarios = await User.count();
        const totalVacantes = await Vacante.count();
        const totalFichas = await FichaTrabajo.count();
        const totalRecomendaciones = await Recomendacion.count();
        const totalContenido = await ContenidoEducativo.count();

        return res.json({
            totalUsuarios,
            totalVacantes,
            totalFichas,
            totalRecomendaciones,
            totalContenido
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al obtener estadísticas' });
    }
};

module.exports = {
    getUsuarios,
    updateUsuario,
    deleteUsuario,
    getContenidoMix,
    deleteContenido,
    getStats
};
