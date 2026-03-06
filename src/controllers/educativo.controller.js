const { ContenidoEducativo } = require('../models');

const getContenidos = async (req, res) => {
    try {
        const contenidos = await ContenidoEducativo.findAll({
            order: [['createdAt', 'DESC']]
        });
        const formatted = contenidos.map(c => {
            const json = c.toJSON();
            json.created_at = json.createdAt;
            delete json.createdAt;
            delete json.updatedAt;
            return json;
        });
        return res.json(formatted);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al obtener contenido educativo' });
    }
};

const getContenidoById = async (req, res) => {
    try {
        const { id } = req.params;
        const contenido = await ContenidoEducativo.findByPk(id);

        if (!contenido) return res.status(404).json({ message: 'Contenido no encontrado' });

        const json = contenido.toJSON();
        json.created_at = json.createdAt;
        delete json.createdAt;
        delete json.updatedAt;

        return res.json(json);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
};

// Se podrían agregar métodos POST/PUT/DELETE para admin aquí en un futuro

module.exports = {
    getContenidos,
    getContenidoById
};
