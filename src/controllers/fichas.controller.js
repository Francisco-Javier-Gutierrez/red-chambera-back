const { FichaTrabajo, User } = require('../models');

const getFichas = async (req, res) => {
    try {
        const { trabajador_id } = req.query;
        const where = {};
        if (trabajador_id) {
            where.trabajador_id = trabajador_id;
        }

        const fichas = await FichaTrabajo.findAll({
            where,
            include: [
                {
                    model: User,
                    as: 'trabajador',
                    attributes: { exclude: ['password'] }
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        const formatted = fichas.map(f => {
            const json = f.toJSON();
            json.created_at = json.createdAt;
            if (json.trabajador) {
                json.trabajador.created_at = json.trabajador.createdAt;
                delete json.trabajador.createdAt;
                delete json.trabajador.updatedAt;
            }
            delete json.createdAt;
            delete json.updatedAt;
            return json;
        });

        return res.json(formatted);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al obtener fichas' });
    }
};

const getFichaById = async (req, res) => {
    try {
        const { id } = req.params;
        const ficha = await FichaTrabajo.findByPk(id, {
            include: [
                {
                    model: User,
                    as: 'trabajador',
                    attributes: { exclude: ['password'] }
                }
            ]
        });

        if (!ficha) return res.status(404).json({ message: 'Ficha no encontrada' });

        const json = ficha.toJSON();
        json.created_at = json.createdAt;
        if (json.trabajador) {
            json.trabajador.created_at = json.trabajador.createdAt;
            delete json.trabajador.createdAt;
            delete json.trabajador.updatedAt;
        }
        delete json.createdAt;
        delete json.updatedAt;

        return res.json(json);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
};

const createFicha = async (req, res) => {
    try {
        const { titulo, descripcion, tipo_trabajo, fecha_realizacion } = req.body;

        // Obtener URLs de los archivos subidos
        const imagenes = [];
        if (req.files && req.files.length > 0) {
            req.files.forEach(file => {
                imagenes.push(`/uploads/${file.filename}`);
            });
        }

        const ficha = await FichaTrabajo.create({
            titulo,
            descripcion,
            tipo_trabajo,
            fecha_realizacion: fecha_realizacion || null,
            imagenes,
            trabajador_id: req.user.id
        });

        const json = ficha.toJSON();
        json.created_at = json.createdAt;
        delete json.createdAt;
        delete json.updatedAt;

        return res.status(201).json(json);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al crear ficha de trabajo' });
    }
};

const deleteFicha = async (req, res) => {
    try {
        const { id } = req.params;
        const ficha = await FichaTrabajo.findByPk(id);

        if (!ficha) return res.status(404).json({ message: 'Ficha no encontrada' });

        // Verificar permisos
        if (ficha.trabajador_id !== req.user.id && req.user.rol !== 'admin') {
            return res.status(403).json({ message: 'No tienes permisos para eliminar esta ficha' });
        }

        await ficha.destroy();
        return res.status(204).send();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al eliminar ficha de trabajo' });
    }
};

module.exports = {
    getFichas,
    getFichaById,
    createFicha,
    deleteFicha
};
