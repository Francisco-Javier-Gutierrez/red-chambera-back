-- ==========================================================
-- SCRIPT DE INICIALIZACIÓN DE BASE DE DATOS `migue_db`
-- (PostgreSQL)
-- ==========================================================

-- 1. Crear el tipo ENUM para roles de usuario
CREATE TYPE "enum_users_rol" AS ENUM ('trabajador', 'empleador', 'admin');

-- 2. Tabla: Users
CREATE TABLE "users" (
    "id" SERIAL PRIMARY KEY,
    "nombre" VARCHAR(255) NOT NULL,
    "whatsapp" VARCHAR(255) NOT NULL UNIQUE,
    "password" VARCHAR(255) NOT NULL,
    "rol" "enum_users_rol" NOT NULL,
    "municipio" VARCHAR(255) NOT NULL,
    "foto_perfil" VARCHAR(255),
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabla: Vacantes
CREATE TABLE "vacantes" (
    "id" SERIAL PRIMARY KEY,
    "titulo" VARCHAR(255) NOT NULL,
    "descripcion" TEXT NOT NULL,
    "tipo_trabajo" VARCHAR(255) NOT NULL,
    "municipio" VARCHAR(255) NOT NULL,
    "horario" VARCHAR(255) NOT NULL,
    "pago" VARCHAR(255) NOT NULL,
    "requisitos" TEXT,
    "whatsapp_contacto" VARCHAR(255) NOT NULL,
    "activa" BOOLEAN DEFAULT true,
    "empleador_id" INTEGER REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 4. Tabla: Fichas de Trabajo
CREATE TABLE "fichas_trabajo" (
    "id" SERIAL PRIMARY KEY,
    "titulo" VARCHAR(255) NOT NULL,
    "descripcion" TEXT NOT NULL,
    "tipo_trabajo" VARCHAR(255) NOT NULL,
    "fecha_realizacion" TIMESTAMP WITH TIME ZONE,
    "imagenes" VARCHAR(255)[] DEFAULT '{}',
    "trabajador_id" INTEGER REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 5. Tabla: Recomendaciones
CREATE TABLE "recomendaciones" (
    "id" SERIAL PRIMARY KEY,
    "comentario" TEXT NOT NULL,
    "puntuacion" INTEGER NOT NULL CHECK ("puntuacion" >= 1 AND "puntuacion" <= 5),
    "trabajador_id" INTEGER REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    "autor_id" INTEGER REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 6. Tabla: Contenido Educativo
CREATE TABLE "contenido_educativo" (
    "id" SERIAL PRIMARY KEY,
    "titulo" VARCHAR(255) NOT NULL,
    "contenido" TEXT NOT NULL,
    "categoria" VARCHAR(255) NOT NULL,
    "imagen" VARCHAR(255),
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================================
-- INSERTAR DATOS DE PRUEBA (DUMMY DATA)
-- (Todas las contraseñas son: 'password123' hasheadas con bcrypt)
-- ==========================================================

-- Usuarios (1 Admin, 1 Empleador, 2 Trabajadores)
INSERT INTO "users" ("nombre", "whatsapp", "password", "rol", "municipio", "foto_perfil") VALUES
('Admin Miguel', '521234567890', '$2b$10$wT3wYQvM/lW9s3gXQ3H8OOaU9ZXZX3zY7yE/cZJpPj/qVvR6N0q6i', 'admin', 'Monterrey', NULL),
('Empresa Construcciones', '528111223344', '$2b$10$wT3wYQvM/lW9s3gXQ3H8OOaU9ZXZX3zY7yE/cZJpPj/qVvR6N0q6i', 'empleador', 'Guadalajara', NULL),
('Juan Carpintero', '528188776655', '$2b$10$wT3wYQvM/lW9s3gXQ3H8OOaU9ZXZX3zY7yE/cZJpPj/qVvR6N0q6i', 'trabajador', 'CDMX', '/uploads/default-carpintero.jpg'),
('Pedro Plomero', '528199998888', '$2b$10$wT3wYQvM/lW9s3gXQ3H8OOaU9ZXZX3zY7yE/cZJpPj/qVvR6N0q6i', 'trabajador', 'Monterrey', NULL);

-- Vacantes (Creadas por el empleador ID: 2)
INSERT INTO "vacantes" ("titulo", "descripcion", "tipo_trabajo", "municipio", "horario", "pago", "requisitos", "whatsapp_contacto", "activa", "empleador_id") VALUES
('Se solicita Carpintero', 'Buscamos carpintero para fabricar 5 muebles de cocina a la medida.', 'Carpintería', 'Guadalajara', 'Lunes a Viernes 8am - 5pm', '$3,500 MXN a la semana', 'Mínimo 3 años de experiencia, traer herramienta propia.', '528111223344', true, 2),
('Plomero Urgente', 'Necesitamos reparación de fugas en edificio principal.', 'Plomería', 'Guadalajara', 'Indefinido (Por proyecto)', '$1,200 MXN el día', 'Experiencia en cobre y tuberías PVC.', '528111223344', true, 2);

-- Fichas de Trabajo (Portafolio de Juan y Pedro)
INSERT INTO "fichas_trabajo" ("titulo", "descripcion", "tipo_trabajo", "fecha_realizacion", "imagenes", "trabajador_id") VALUES
('Instalación de Cocina Integral', 'Fabricación de clóset y cocina integral en madera de encino.', 'Carpintería', '2023-10-15', '{"/uploads/trabajo1.jpg", "/uploads/trabajo2.jpg"}', 3),
('Reparación de filtración de agua', 'Se reparó una fuga interna que generaba humedad en la pared.', 'Plomería', '2023-11-02', '{"/uploads/plomeria1.jpg"}', 4);

-- Recomendaciones (El empleador valora a los trabajadores)
INSERT INTO "recomendaciones" ("comentario", "puntuacion", "trabajador_id", "autor_id") VALUES
('Excelente trabajo, Juan fabricó la cocina justo a tiempo y con materiales de primera.', 5, 3, 2),
('Muy buen servicio, llegó a la hora acordada. Sólo manchó un poco el piso.', 4, 4, 2);

-- Contenido Educativo
INSERT INTO "contenido_educativo" ("titulo", "contenido", "categoria", "imagen") VALUES
('¿Cómo calcular tu tarifa por hora?', 'Para calcular tu tarifa por hora debes tener en cuenta el costo de tus materiales, transporte, tiempo estimado...', 'Tips Financieros', '/uploads/tips.jpg'),
('Seguridad básica en obras', 'Utilizar siempre casco, botas con casquillo y lentes protectores. La seguridad es primero...', 'Seguridad', NULL);
