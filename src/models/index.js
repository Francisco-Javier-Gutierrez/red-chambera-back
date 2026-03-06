const User = require('./User');
const Vacante = require('./Vacante');
const FichaTrabajo = require('./FichaTrabajo');
const Recomendacion = require('./Recomendacion');
const ContenidoEducativo = require('./ContenidoEducativo');

// Relaciones:

// User (Empleador) -> Vacantes (1:N)
User.hasMany(Vacante, { foreignKey: 'empleador_id', as: 'vacantes' });
Vacante.belongsTo(User, { foreignKey: 'empleador_id', as: 'empleador' });

// User (Trabajador) -> FichasTrabajo (1:N)
User.hasMany(FichaTrabajo, { foreignKey: 'trabajador_id', as: 'fichas' });
FichaTrabajo.belongsTo(User, { foreignKey: 'trabajador_id', as: 'trabajador' });

// User -> Recomendaciones (Destinatario / N:1 o 1:N)
// "Un trabajador recibe muchas recomendaciones"
User.hasMany(Recomendacion, { foreignKey: 'trabajador_id', as: 'recomendacionesRecibidas' });
Recomendacion.belongsTo(User, { foreignKey: 'trabajador_id', as: 'trabajador' });

// User -> Recomendaciones (Remitente / N:1 o 1:N)
// "Un usuario puede autorar muchas recomendaciones"
User.hasMany(Recomendacion, { foreignKey: 'autor_id', as: 'recomendacionesDadas' });
Recomendacion.belongsTo(User, { foreignKey: 'autor_id', as: 'autor' });

module.exports = {
    User,
    Vacante,
    FichaTrabajo,
    Recomendacion,
    ContenidoEducativo,
};
