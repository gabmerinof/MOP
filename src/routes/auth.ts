import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { container } from "../inversify.config";
import { validateLogin, validateRegister } from '../middleware/validation';
import { TYPES } from '../types/types';

const router = Router();
const authController = container.get<AuthController>(TYPES.AuthController);

router.post('/register', validateRegister, authController.register);
router.post('/login', validateLogin, authController.login);

export default router;