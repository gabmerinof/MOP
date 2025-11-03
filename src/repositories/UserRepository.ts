import { IUser, IUserCreate, UserResponse } from '../types';
import { User } from '../models/User';
import { injectable } from 'inversify';
import { IUserRepository } from './interfaces';

@injectable()
export class UserRepository implements IUserRepository {
    async create(userData: IUserCreate): Promise<UserResponse> {
        const user = await User.create(userData);
        return {
            userid: user.userid,
            username: user.username,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        } as UserResponse;
    }

    async findByUsername(username: string): Promise<IUser | null> {
        const user = await User.findOne({ where: { username } });

        return user ? ({
            userid: user.userid,
            username: user.username,
            password: user.password,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        } as IUser) : null;
    }

    async findAll(): Promise<IUser[] | null> {
        const user = await User.findAll();
        return user as IUser[];
    }

    async findById(userId: string): Promise<IUser | null> {
        const user = await User.findByPk(userId);
        return user ? (user.toJSON() as IUser) : null;
    }

    async findByEmail(email: string): Promise<IUser | null> {
        const user = await User.findOne({ where: { email } });
        return user ? (user.toJSON() as IUser) : null;
    }
}