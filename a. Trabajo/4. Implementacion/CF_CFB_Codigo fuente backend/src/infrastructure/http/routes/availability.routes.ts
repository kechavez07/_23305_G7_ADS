import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { UserRole } from "@prisma/client";
import { PrismaAvailabilityRepository } from "../../database/prisma/repositories/prisma-availability.repository";
import { CreateAvailabilityUseCase } from "../../../application/use-cases/availability/create-availability.use-case";
import { GetAvailabilitiesBySpecialistUseCase } from "../../../application/use-cases/availability/get-availabilities-by-specialist.use-case";
import { DeleteAvailabilityUseCase } from "../../../application/use-cases/availability/delete-availability.use-case";
import { AvailabilityController } from "../controllers/availability.controller";
import { UpdateAvailabilityUseCase } from "../../../application/use-cases/availability/update-availability.use-case";
import { CreateWeeklyScheduleUseCase } from "../../../application/use-cases/availability/create-weekly-schedule.use-case";

const router = Router();

// --- Dependencias ---
const availabilityRepository = new PrismaAvailabilityRepository();
const createAvailabilityUseCase = new CreateAvailabilityUseCase(availabilityRepository);
const getAvailabilitiesBySpecialistUseCase = new GetAvailabilitiesBySpecialistUseCase(availabilityRepository);
const deleteAvailabilityUseCase = new DeleteAvailabilityUseCase(availabilityRepository);
const updateAvailabilityUseCase = new UpdateAvailabilityUseCase(availabilityRepository);
const createWeeklyScheduleUseCase = new CreateWeeklyScheduleUseCase(availabilityRepository);

const availabilityController = new AvailabilityController(
    createAvailabilityUseCase,
    getAvailabilitiesBySpecialistUseCase,
    deleteAvailabilityUseCase,
     updateAvailabilityUseCase,
    availabilityRepository, // El controlador lo necesita para validaciones de permisos
     createWeeklyScheduleUseCase,
);

// --- Rutas ---

// Crear disponibilidad (protegido para ADMIN y ESPECIALISTA)
router.post(
    '/',
    authMiddleware([UserRole.ADMIN, UserRole.ESPECIALISTA]),
    (req, res) => availabilityController.create(req, res)
);

// Obtener disponibilidad de un especialista (abierto a todos los autenticados)
// Ejemplo: /api/availabilities/specialist/uuid-del-especialista?start=2024-01-01T00:00:00Z&end=2024-01-07T23:59:59Z
router.get(
    '/specialist/:specialistId',
    authMiddleware([UserRole.ADMIN, UserRole.ESPECIALISTA, UserRole.CLIENTE]),
    (req, res) => availabilityController.getBySpecialist(req, res)
);

// Eliminar disponibilidad (protegido para ADMIN y ESPECIALISTA)
router.delete(
    '/:id',
    authMiddleware([UserRole.ADMIN, UserRole.ESPECIALISTA]),
    (req, res) => availabilityController.delete(req, res)
);

// Actualizar disponibilidad (protegido para ADMIN y ESPECIALISTA)
router.put(
    '/:id',
    authMiddleware([UserRole.ADMIN, UserRole.ESPECIALISTA]),
    (req, res) => availabilityController.update(req, res)
);

//crear un horario semanal
router.post(
    '/schedule',
    authMiddleware([UserRole.ADMIN, UserRole.ESPECIALISTA]),
    (req, res) => availabilityController.createWeeklySchedule(req, res)
);

export default router;