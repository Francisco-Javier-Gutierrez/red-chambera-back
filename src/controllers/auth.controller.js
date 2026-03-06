const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, rol: user.rol },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
};

const register = async (req, res) => {
    try {
        const { nombre, whatsapp, password, rol, municipio } = req.body;

        // Verificar si el usuario ya existe
        const userExists = await User.findOne({ where: { whatsapp } });
        if (userExists) {
            return res.status(400).json({ message: 'El usuario con ese número de WhatsApp ya existe' });
        }

        // Hashear contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Crear usuario
        const user = await User.create({
            nombre,
            whatsapp,
            password: hashedPassword,
            rol,
            municipio
        });

        const token = generateToken(user);
        const userResponse = {
            id: user.id,
            nombre: user.nombre,
            whatsapp: user.whatsapp,
            rol: user.rol,
            municipio: user.municipio,
            foto_perfil: user.foto_perfil,
            created_at: user.createdAt
        };

        return res.status(201).json({ token, user: userResponse });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { whatsapp, password } = req.body;

        const user = await User.findOne({ where: { whatsapp } });
        if (!user) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        const token = generateToken(user);
        const userResponse = {
            id: user.id,
            nombre: user.nombre,
            whatsapp: user.whatsapp,
            rol: user.rol,
            municipio: user.municipio,
            foto_perfil: user.foto_perfil,
            created_at: user.createdAt
        };

        return res.json({ token, user: userResponse });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
};

const getMe = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password'] }
        });

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const userObj = user.toJSON();
        userObj.created_at = userObj.createdAt;
        delete userObj.createdAt;
        delete userObj.updatedAt;

        return res.json(userObj);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
};

const updatePerfil = async (req, res) => {
    try {
        const { nombre, municipio, oficios, descripcion, disponibilidad, nombre_negocio, tipo_negocio, direccion } = req.body;
        let foto_perfil = req.body.foto_perfil; // Por si mandan una url existente y no suben un archivo nuevo

        if (req.file) {
            // Ajustar la ruta para la base de datos (dependiendo de la URL base del server, guardamos ruta relativa)
            foto_perfil = `/uploads/${req.file.filename}`;
        }

        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        user.nombre = nombre || user.nombre;
        user.municipio = municipio || user.municipio;

        // Manejo de campos opcionales extendidos (evitamos sobrescribir con undefined)
        if (oficios !== undefined) user.oficios = typeof oficios === 'string' ? JSON.parse(oficios) : oficios;
        if (descripcion !== undefined) user.descripcion = descripcion;
        if (disponibilidad !== undefined) user.disponibilidad = disponibilidad;
        if (nombre_negocio !== undefined) user.nombre_negocio = nombre_negocio;
        if (tipo_negocio !== undefined) user.tipo_negocio = tipo_negocio;
        if (direccion !== undefined) user.direccion = direccion;

        if (foto_perfil !== undefined) {
            user.foto_perfil = foto_perfil;
        }

        await user.save();

        const userObj = user.toJSON();
        delete userObj.password;
        userObj.created_at = userObj.createdAt;
        delete userObj.createdAt;
        delete userObj.updatedAt;

        return res.json(userObj);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
};

module.exports = {
    register,
    login,
    getMe,
    updatePerfil
};
