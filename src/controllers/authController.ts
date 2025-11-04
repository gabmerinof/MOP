import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { AuthService } from '../services/AuthService';
import { IAuthService } from '../services/interfaces';
import { AppError } from '../utils/AppError';

@injectable()
export class AuthController {

    constructor(@inject(AuthService) private readonly authService: IAuthService) {
    }

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