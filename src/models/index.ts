import sequelize from '../config/database';
import { User } from './User';
import { GeoPoint } from './GeoPoint';

User.hasMany(GeoPoint, { foreignKey: 'userid', as: 'geo_points' });
GeoPoint.belongsTo(User, { foreignKey: 'userid', as: 'users' });

export { sequelize, User, GeoPoint };