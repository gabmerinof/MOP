export interface IUserGeneric { }
export interface IUser extends IUserGeneric {
    userid: string;
    username: string;
    password: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface UserInput extends IUser { }
export interface IUserCreate extends Omit<IUser, 'userid' | 'createdAt' | 'updatedAt'> { }
export interface UserResponse extends Omit<IUser, 'password'> { }
export interface LoginCredentials extends Omit<IUser, 'userid' | 'email' | 'createdAt' | 'updatedAt'> { }
export interface AuthResponse {
    message: string;
    token: string;
    user: Omit<IUser, 'password'>;
}

export interface IGeoPoint {
    geopointid: string;
    latitude: number;
    longitude: number;
    type: 'accidente' | 'congestión' | 'obstrucción' | 'otro';
    description?: string;
    userid: string;
    geom?: object;
    createdAt: Date;
    updatedAt: Date;
}
export interface IGeoPointCreate extends Omit<IGeoPoint, 'geopointid' | 'userid' | 'createdAt' | 'updatedAt'> { }
export interface IGeoPointUpdate extends IGeoPointCreate { }

export interface ProximityFilter {
    type?: string;
    lat?: number;
    long?: number;
    radius?: number;
}