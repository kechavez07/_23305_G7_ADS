import { Router , Request, Response} from 'express';
import { PrismaUserRepository } from '../../database/prisma/repositories/prisma-user.repository';
import { RegisterUserUseCase } from '../../../application/use-cases/auth/register-user.use-case';
import { LoginUserUseCase } from '../../../application/use-cases/auth/login-user.use-case'; 

import { AuthController } from '../controllers/auth.controller';
import { NodemailerService } from '../../services/nodemailer.service';

const router = Router();

// --- Inyección de Dependencias ---
// Aquí es donde "construimos" nuestras clases, inyectando las dependencias necesarias.
const userRepository = new PrismaUserRepository();
const emailService = new NodemailerService();


const registerUserUseCase = new RegisterUserUseCase(userRepository, emailService);
const loginUserUseCase = new LoginUserUseCase(userRepository); 

const authController = new AuthController(registerUserUseCase, loginUserUseCase);

// --- Definición de Rutas ---
router.post('/register', async (req: Request, res: Response) => {
  await authController.register(req, res);
});

router.post('/login', async (req: Request, res: Response) => {
  await authController.login(req, res); 
});

export default router;