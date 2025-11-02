import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';

export class AuthController {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    getAll = async (req: Request, res: Response): Promise<void> => {
        try {
            const users = await this.authService.getAll();

            res.status(200).json({
                users: users,
                count: users?.length
            });
        } catch (error: any) {
            res.status(400).json({
                error: 'AUTH_ERROR',
                message: error.message
            });
        }
    };

    register = async (req: Request, res: Response): Promise<void> => {
        try {
            const user = await this.authService.register(req.body);

            res.status(200).json({
                ...user
            });
        } catch (error: any) {
            res.status(400).json({
                error: 'REGISTER_ERROR',
                message: error.message
            });
        }
    };

    login = async (req: Request, res: Response): Promise<void> => {
        try {
            const result = await this.authService.login(req.body);

            res.status(200).json({
                ...result
            });
        } catch (error: any) {
            res.status(401).json({
                error: 'AUTH_ERROR',
                message: error.message
            });
        }
    };
}