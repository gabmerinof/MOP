import { IGeoPoint, IGeoPointCreate, IGeoPointUpdate, ProximityFilter } from '../../types';

export interface IGeoPointRepository {
    create(pointData: IGeoPointCreate): Promise<IGeoPoint>;
    findById(id: string): Promise<IGeoPoint | null>;
    findAll(filters?: ProximityFilter): Promise<IGeoPoint[]>;
    findByUserId(userId: string): Promise<IGeoPoint[]>;
    update(id: string, pointData: IGeoPointUpdate): Promise<IGeoPoint | null>;
    delete(id: string): Promise<boolean>;
    findByProximity(lat: number, long: number, radius: number, type?: string): Promise<IGeoPoint[]>;
}