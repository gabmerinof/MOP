import { IUser, IUserCreate, LoginCredentials, AuthResponse } from '../../types';

export interface IAuthService {
    register(userData: IUserCreate): Promise<Omit<IUser, 'password'>>;
    login(credentials: LoginCredentials): Promise<AuthResponse>;
    validateToken(token: string): Promise<IUser>;
}