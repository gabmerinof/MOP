import { IUser, IUserCreate, LoginCredentials, AuthResponse } from '../../types';
import { IGeoPoint, IGeoPointCreate, IGeoPointUpdate, ProximityFilter } from '../../types';

export interface IAuthService {
    register(userData: IUserCreate): Promise<Omit<IUser, 'password'>>;
    login(credentials: LoginCredentials): Promise<AuthResponse>;
    validateToken(token: string): Promise<IUser>;
}

export interface IGeoPointService {
    createPoint(pointData: IGeoPointCreate): Promise<IGeoPoint>;
    getPointById(id: string): Promise<IGeoPoint | null>;
    getAllPoints(filters?: ProximityFilter): Promise<IGeoPoint[]>;
    updatePoint(id: string, pointData: IGeoPointUpdate, userId: string): Promise<IGeoPoint | null>;
    deletePoint(id: string, userId: string): Promise<boolean>;
    getUserPoints(userId: string): Promise<IGeoPoint[]>;
}