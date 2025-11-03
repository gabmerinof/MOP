import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { AuthService } from '../services/AuthService';
import { TYPES } from '../types/types';
import { AppError } from '../utils/AppError';

@injectable()
export class AuthController {

    constructor(@inject(TYPES.AuthService) private readonly authService: AuthService) {
    }

    getAll = async (req: Request, res: Response): Promise<void> => {
        try {
            const users = await this.authService.getAll();

            res.status(200).json({
                users: users,
                count: users?.length
            });
        } catch (error: any) {
            throw new AppError('AUTH_ERROR', error.message, 400);
        }
    };

    register = async (req: Request, res: Response): Promise<void> => {
        try {
            const user = await this.authService.register(req.body);

            res.status(200).json({
                ...user
            });
        } catch (error: any) {
            throw new AppError('REGISTER_ERROR', error.message, 400);
        }
    };

    login = async (req: Request, res: Response): Promise<void> => {
        try {
            const result = await this.authService.login(req.body);

            res.status(200).json({
                ...result
            });
        } catch (error: any) {
            throw new AppError('AUTH_ERROR', error.message, 401);
        }
    };
}