import { IGeoPoint, IGeoPointCreate, IGeoPointUpdate, ProximityFilter } from '../../types';

export interface IGeoPointService {
    createPoint(pointData: IGeoPointCreate, userId: string): Promise<IGeoPoint>;
    getPointById(id: string): Promise<IGeoPoint | null>;
    getAllPoints(filters?: ProximityFilter): Promise<IGeoPoint[]>;
    updatePoint(id: string, pointData: IGeoPointUpdate, userId: string): Promise<IGeoPoint | null>;
    deletePoint(id: string, userId: string): Promise<boolean>;
    getUserPoints(userId: string): Promise<IGeoPoint[]>;
}