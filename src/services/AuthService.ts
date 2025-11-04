import { inject, injectable } from 'inversify';
import * as jwt from 'jsonwebtoken';
import { IUserRepository } from '../repositories/interfaces';
import { UserRepository } from '../repositories/UserRepository';
import { AuthResponse, IUser, IUserCreate, LoginCredentials } from '../types';
import { IAuthService } from './interfaces';

@injectable()
export class AuthService implements IAuthService {

    constructor(@inject(UserRepository) private readonly userRepository: IUserRepository) {

    }

    async register(userData: IUserCreate): Promise<Omit<IUser, 'password'>> {
        const existingUser = await this.userRepository.findByUsername(userData.username);
        if (existingUser) {
            throw new Error('El nombre de usuario ya está en uso');
        }

        if (userData.email) {
            const existingEmail = await this.userRepository.findByEmail(userData.email);
            if (existingEmail) {
                throw new Error('El email ya está en uso');
            }
        }

        return await this.userRepository.create(userData);
    }

    async getAll(): Promise<IUser[] | null> {

        return await this.userRepository.findAll();
    }

    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const user = await this.userRepository.findByUsername(credentials.username);
        if (!user)
            throw new Error('Credenciales inválidas');

        const isValidPassword = await this.validatePassword(credentials.password, user.password);
        if (!isValidPassword)
            throw new Error('Credenciales inválidas');

        const token = this.generateToken(user);
        const { password, ...userWithoutPassword } = user;

        return {
            message: 'Autenticación exitosa',
            token: token,
            user: userWithoutPassword
        };
    }

    async validateToken(token: string): Promise<IUser> {
        try {
            const decoded = jwt.verify(token, process.env['JWT_SECRET']!) as any;
            const user = await this.userRepository.findById(decoded.userId);
            if (!user) {
                throw new Error('Usuario no encontrado');
            }
            return user;
        } catch (error) {
            throw new Error('Token inválido');
        }
    }

    private async validatePassword(password: string, hashedPassword: string): Promise<boolean> {
        const bcrypt = require('bcryptjs');
        return bcrypt.compare(password, hashedPassword);
    }

    private generateToken(user: IUser): string {
        return jwt.sign(
            { userId: user.userid, username: user.username },
            process.env['JWT_SECRET']!,
            { expiresIn: `${parseInt(process.env['JWT_EXPIRES_IN']!)}h` }
        );
    }
}