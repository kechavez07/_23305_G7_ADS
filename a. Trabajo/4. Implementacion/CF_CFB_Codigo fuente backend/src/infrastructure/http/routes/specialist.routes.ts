import { Router } from "express";
import { PrismaSpecialistRepository } from "../../database/prisma/repositories/prisma-specialist.repository";
import { PrismaUserRepository } from "../../database/prisma/repositories/prisma-user.repository";
import { NodemailerService } from "../../services/nodemailer.service";
import { CreateSpecialistDto, UpdateSpecialistDto } from "../../../application/dtos/specialist.dtos";
import { CreateSpecialistUseCase } from "../../../application/use-cases/specialist/create-specialist.use-case";
import { GetAllSpecialistsUseCase } from "../../../application/use-cases/specialist/get-all-specialists.use-case";
import { GetSpecialistByIdUseCase } from "../../../application/use-cases/specialist/get-specialist-by-id.use-case";
import { UpdateSpecialistUseCase } from "../../../application/use-cases/specialist/update-specialist.use-case";
import { DeactivateSpecialistUseCase } from "../../../application/use-cases/specialist/deactivate-specialist.use-case";
import { SpecialistController } from "../controllers/specialist.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { LoggingProxy } from "../../../application/proxies/logging.proxy";
import { UserRole } from "@prisma/client";

const router = Router();

// --- Dependencias ---
const specialistRepository = new PrismaSpecialistRepository();
const userRepository = new PrismaUserRepository(); // Necesario para el caso de uso de creación
const emailService = new NodemailerService();

// --- Creación de Instancias REALES de los Casos de Uso ---
// Creamos las instancias originales de nuestros casos de uso.
const createSpecialistUseCaseReal = new CreateSpecialistUseCase(userRepository, specialistRepository, emailService);
const getAllSpecialistsUseCaseReal = new GetAllSpecialistsUseCase(specialistRepository);
const getSpecialistByIdUseCaseReal = new GetSpecialistByIdUseCase(specialistRepository);
const updateSpecialistUseCaseReal = new UpdateSpecialistUseCase(specialistRepository);
const deactivateSpecialistUseCaseReal = new DeactivateSpecialistUseCase(specialistRepository);

// --- Aplicación del Patrón Proxy ---
// "Envolvemos" cada instancia real con nuestro LoggingProxy.
// El proxy recibe el caso de uso real y lo guarda internamente.
const createSpecialistUseCaseWithLogging = new LoggingProxy(createSpecialistUseCaseReal);
const getAllSpecialistsUseCaseWithLogging = new LoggingProxy(getAllSpecialistsUseCaseReal);
const getSpecialistByIdUseCaseWithLogging = new LoggingProxy(getSpecialistByIdUseCaseReal);
const updateSpecialistUseCaseWithLogging = new LoggingProxy(updateSpecialistUseCaseReal);
const deactivateSpecialistUseCaseWithLogging = new LoggingProxy(deactivateSpecialistUseCaseReal);

// // --- Casos de Uso ---
// const createSpecialistUseCase = new CreateSpecialistUseCase(userRepository, specialistRepository,emailService);
// const getAllSpecialistsUseCase = new GetAllSpecialistsUseCase(specialistRepository);
// const getSpecialistByIdUseCase = new GetSpecialistByIdUseCase(specialistRepository);
//const updateSpecialistUseCase = new UpdateSpecialistUseCase(specialistRepository);
// const deactivateSpecialistUseCase = new DeactivateSpecialistUseCase(specialistRepository);

// --- Proxies ---



// --- Controlador ---
const specialistController = new SpecialistController(
    createSpecialistUseCaseWithLogging,
    getAllSpecialistsUseCaseWithLogging,
    getSpecialistByIdUseCaseWithLogging,
    updateSpecialistUseCaseWithLogging,
    deactivateSpecialistUseCaseWithLogging
);

// Todas estas rutas son solo para el ADMIN
//router.use(authMiddleware([UserRole.ADMIN]));

//router.post('/', (req, res) => specialistController.create(req, res));
//router.get('/', (req, res) => specialistController.getAll(req, res));
//router.get('/:id', (req, res) => specialistController.getById(req, res));
//router.put('/:id', (req, res) => specialistController.update(req, res));
//router.delete('/:id', (req, res) => specialistController.deactivate(req, res));


// --- Rutas de Lectura (GET) - Abiertas a todos los roles autenticados ---
router.get(
    '/',
    authMiddleware([UserRole.ADMIN, UserRole.CLIENTE, UserRole.ESPECIALISTA]),
    (req, res) => specialistController.getAll(req, res)
);

router.get(
    '/:id',
    authMiddleware([UserRole.ADMIN, UserRole.CLIENTE, UserRole.ESPECIALISTA]),
    (req, res) => specialistController.getById(req, res)
);


// --- Rutas de Escritura (POST, PUT, DELETE) - Solo para ADMIN ---
router.post(
    '/',
    authMiddleware([UserRole.ADMIN]),
    (req, res) => specialistController.create(req, res)
);

router.put(
    '/:id',
    authMiddleware([UserRole.ADMIN]),
    (req, res) => specialistController.update(req, res)
);

router.delete(
    '/:id',
    authMiddleware([UserRole.ADMIN]),
    (req, res) => specialistController.deactivate(req, res)
);




export default router;