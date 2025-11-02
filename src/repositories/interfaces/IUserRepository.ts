import { IUser, IUserCreate, UserResponse } from '../../types';

export interface IUserRepository {
    create(userData: IUserCreate): Promise<UserResponse>;
    findByUsername(username: string): Promise<IUser | null>;
    findById(id: string): Promise<IUser | null>;
    findAll(): Promise<IUser[] | null>;
    findByEmail(email: string): Promise<IUser | null>;
}