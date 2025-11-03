import { IGeoPoint, IGeoPointCreate, IGeoPointUpdate, ProximityFilter } from '../types';
import { User } from '../models/User';
import { GeoPoint } from '../models/GeoPoint';
import { QueryTypes } from 'sequelize';
import sequelize from '../config/database';
import { injectable } from 'inversify';
import { IGeoPointRepository } from './interfaces';

@injectable()
export class GeoPointRepository implements IGeoPointRepository {
    async create(pointData: IGeoPointCreate): Promise<IGeoPoint> {
        pointData.geom = this.getGeometryPoint(pointData.longitude, pointData.latitude);
        const point = await GeoPoint.create({
            ...pointData
        });

        return point.toJSON() as IGeoPoint;
    }

    async findById(geoPointId: string): Promise<IGeoPoint | null> {
        const point = await GeoPoint.findByPk(geoPointId, {
            include: [{
                model: User,
                as: 'user',
                attributes: ['userid', 'username', 'email']
            }]
        });

        return point ? point.toJSON() : null;
    }

    async findAll(filters?: ProximityFilter): Promise<IGeoPoint[]> {
        if (filters?.lat && filters?.long && filters?.radius) {
            return this.findByProximity(
                filters.lat,
                filters.long,
                filters.radius,
                filters.type
            );
        }

        let whereClause: any = {};
        if (filters?.type)
            whereClause.type = filters.type;

        const points = await GeoPoint.findAll({
            where: whereClause,
            include: [{
                model: User,
                as: 'user',
                attributes: ['userid', 'username', 'email']
            }],
            order: [['createdAt', 'DESC']]
        });

        return points.map(point => point.toJSON());
    }

    async findByUserId(userid: string): Promise<IGeoPoint[]> {
        const points = await GeoPoint.findAll({
            where: { userid },
            include: [{
                model: User,
                as: 'user',
                attributes: ['userid', 'username', 'email']
            }],
            order: [['createdAt', 'DESC']]
        });

        return points.map(point => point.toJSON());
    }

    async update(geoPointId: string, pointData: IGeoPointUpdate): Promise<IGeoPoint | null> {
        const point = await GeoPoint.findByPk(geoPointId);
        if (!point) return null;

        pointData.geom = this.getGeometryPoint(pointData.longitude, pointData.latitude);
        await point.update(pointData);

        return point.toJSON();
    }

    async delete(geopointid: string): Promise<boolean> {
        const deleted = await GeoPoint.destroy({ where: { geopointid } });
        return deleted > 0;
    }

    async findByProximity(lat: number, long: number, radius: number, type?: string): Promise<IGeoPoint[]> {
        const query = `SELECT 
                            gp.*,
                            u.username,
                            u.email,
                            ST_Distance(
                            ST_SetSRID(ST_MakePoint(:long, :lat), 4326)::geography,
                            ST_SetSRID(ST_MakePoint(gp.longitude, gp.latitude), 4326)::geography
                            ) as distance
                        FROM geo_points gp
                        INNER JOIN users u ON gp.userid = u.userid
                        WHERE ST_DWithin(
                            ST_SetSRID(ST_MakePoint(:long, :lat), 4326)::geography,
                            ST_SetSRID(ST_MakePoint(gp.longitude, gp.latitude), 4326)::geography,
                            :radius * 1000
                        )
                        ${type ? 'AND gp.type = :type' : ''}
                        ORDER BY distance ASC`;

        const points = await sequelize.query(query, {
            replacements: { lat, long, radius, type },
            type: QueryTypes.SELECT,
            mapToModel: true,
            model: GeoPoint
        });

        return points.map(point => point.toJSON());
    }

    private getGeometryPoint(latitude: number, longitude: number): object {
        const geom = {
            type: 'Point',
            coordinates: [longitude, latitude],
            crs: { type: 'name', properties: { name: 'EPSG:4326' } }
        }

        return geom;
    }
}