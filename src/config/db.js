const { Sequelize } = require('sequelize');
const pg = require('pg');
pg.defaults.ssl = { rejectUnauthorized: false };
require('dotenv').config();

const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      dialectModule: pg, // <--- ESTO ES LO QUE FALTABA
      logging: false, 
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
    })
  : new Sequelize(
      process.env.DATABASE_NAME,
      process.env.DATABASE_USER,
      process.env.DATABASE_PASSWORD,
      {
        host: process.env.DATABASE_HOST,
        port: process.env.DATABASE_PORT || 5432,
        dialect: 'postgres',
        dialectModule: pg,
        logging: false,
      }
    );

module.exports = sequelize;