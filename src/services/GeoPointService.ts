import { inject, injectable } from 'inversify';
import { IGeoPointRepository } from '../repositories/interfaces/IGeoPointRepository';
import { IGeoPoint, IGeoPointCreate, IGeoPointUpdate, ProximityFilter } from '../types';
import { TYPES } from '../types/types';
import { IGeoPointService } from './interfaces/IGeoPointService';

@injectable()
export class GeoPointService implements IGeoPointService {

    constructor(@inject(TYPES.GeoPointRepository) private readonly geoPointRepository: IGeoPointRepository) {

    }

    async createPoint(pointData: IGeoPointCreate): Promise<IGeoPoint> {
        this.validateGeoPointData(pointData);
        return await this.geoPointRepository.create(pointData);
    }

    async getPointById(geoPointId: string): Promise<IGeoPoint | null> {
        return await this.geoPointRepository.findById(geoPointId);
    }

    async getAllPoints(filters?: ProximityFilter): Promise<IGeoPoint[]> {
        return await this.geoPointRepository.findAll(filters);
    }

    async updatePoint(geoPointId: string, pointData: IGeoPointUpdate, userid: string): Promise<IGeoPoint | null> {
        const point = await this.geoPointRepository.findById(geoPointId);
        if (!point) 
            throw new Error('Punto Geoferencial no encontrado');
        
        if (point.userid !== userid)
            throw new Error('No tienes permisos para actualizar este punto');
        
        if (pointData.latitude !== undefined || pointData.longitude !== undefined) {
            this.validateGeoPointData({
                latitude: pointData.latitude || point.latitude,
                longitude: pointData.longitude || point.longitude,
                type: pointData.type || point.type
            });
        }

        return await this.geoPointRepository.update(geoPointId, pointData);
    }

    async deletePoint(geoPointId: string, userId: string): Promise<boolean> {
        const point = await this.geoPointRepository.findById(geoPointId);
        if (!point) {
            throw new Error('Punto Geoferencial no encontrado');
        }

        if (point.userid !== userId) {
            throw new Error('No tienes permisos para eliminar este punto');
        }

        return await this.geoPointRepository.delete(geoPointId);
    }

    async getUserPoints(userId: string): Promise<IGeoPoint[]> {
        return await this.geoPointRepository.findByUserId(userId);
    }

    private validateGeoPointData(pointData: { latitude: number; longitude: number; type: string }): void {
        if (pointData.latitude < -90 || pointData.latitude > 90) {
            throw new Error('Latitud debe estar entre -90 y 90');
        }

        if (pointData.longitude < -180 || pointData.longitude > 180) {
            throw new Error('Longitud debe estar entre -180 y 180');
        }

        const validTypes = ['accidente', 'congestión', 'obstrucción', 'otro'];
        if (!validTypes.includes(pointData.type)) {
            throw new Error('Tipo debe ser: accidente, congestión, obstrucción u otro');
        }
    }
}