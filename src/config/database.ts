import { Sequelize } from 'sequelize-typescript';
import { config, dialect } from '../config/config';
import { GeoPoint } from '../models/GeoPoint';
import { User } from '../models/User';

(Sequelize as any).DataTypes.postgres.DECIMAL.parse = parseFloat;

const sequelize = new Sequelize({
    database: config.DB,
    username: config.USER,
    password: config.PASSWORD,
    host: config.HOST,
    port: config.PORT,
    dialect: dialect,
    pool: {
        max: config.pool.max,
        min: config.pool.min,
        acquire: config.pool.acquire,
        idle: config.pool.idle
    },
    logging: process.env['NODE_ENV'] === 'development' ? console.log : false,
    models: [User, GeoPoint],
    dialectOptions: {
        useUTC: false
    },
    define: {
        timestamps: true,
        underscored: true,
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    }
});

export default sequelize;