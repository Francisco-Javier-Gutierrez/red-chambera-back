const roleMiddleware = (rolesPermitidos) => {
    return (req, res, next) => {
        if (!req.user || !req.user.rol) {
            return res.status(401).json({ message: 'Usuario no autenticado o no tiene un rol asignado' });
        }

        if (!rolesPermitidos.includes(req.user.rol)) {
            return res.status(403).json({ message: 'No tienes permisos para realizar esta acción' });
        }

        next();
    };
};

module.exports = roleMiddleware;
