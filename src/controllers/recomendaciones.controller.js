const { Recomendacion, User } = require('../models');

const getRecomendaciones = async (req, res) => {
    try {
        const { trabajador_id } = req.query;

        if (!trabajador_id) {
            return res.status(400).json({ message: 'El parámetro trabajador_id es requerido' });
        }

        const recomendaciones = await Recomendacion.findAll({
            where: { trabajador_id },
            include: [
                {
                    model: User,
                    as: 'autor',
                    attributes: { exclude: ['password'] }
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        const formatted = recomendaciones.map(r => {
            const json = r.toJSON();
            json.created_at = json.createdAt;
            if (json.autor) {
                json.autor.created_at = json.autor.createdAt;
                delete json.autor.createdAt;
                delete json.autor.updatedAt;
            }
            delete json.createdAt;
            delete json.updatedAt;
            return json;
        });

        return res.json(formatted);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al obtener recomendaciones' });
    }
};

const createRecomendacion = async (req, res) => {
    try {
        const { trabajador_id, comentario, puntuacion } = req.body;

        if (!trabajador_id || !comentario || !puntuacion) {
            return res.status(400).json({ message: 'Faltan campos requeridos' });
        }

        // Un usuario no debería poder recomendarse a sí mismo
        if (parseInt(trabajador_id) === req.user.id) {
            return res.status(400).json({ message: 'No puedes recomendarte a ti mismo' });
        }

        // Verificar si el destinatario es un trabajador
        const trabajador = await User.findByPk(trabajador_id);
        if (!trabajador || trabajador.rol !== 'trabajador') {
            return res.status(404).json({ message: 'Trabajador no encontrado o no válido para recomendaciones' });
        }

        const recomendacion = await Recomendacion.create({
            trabajador_id,
            autor_id: req.user.id,
            comentario,
            puntuacion
        });

        const json = recomendacion.toJSON();
        json.created_at = json.createdAt;
        delete json.createdAt;
        delete json.updatedAt;

        return res.status(201).json(json);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al crear la recomendación' });
    }
};

module.exports = {
    getRecomendaciones,
    createRecomendacion
};
