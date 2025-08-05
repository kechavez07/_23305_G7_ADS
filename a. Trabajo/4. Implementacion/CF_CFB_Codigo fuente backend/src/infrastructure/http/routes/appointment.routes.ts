import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { UserRole } from "@prisma/client";
import { PrismaAppointmentRepository } from "../../database/prisma/repositories/prisma-appointment.repository";
import { PrismaAvailabilityRepository } from "../../database/prisma/repositories/prisma-availability.repository";
import { PrismaUserRepository } from "../../database/prisma/repositories/prisma-user.repository";
import { ReserveAppointmentUseCase } from "../../../application/use-cases/appointment/reserve-appointment.use-case";
import { GetMyAppointmentsUseCase } from "../../../application/use-cases/appointment/get-my-appointments.use-case";
import { AppointmentController } from "../controllers/appointment.controller";

const router = Router();

// --- Dependencias ---
const appointmentRepository = new PrismaAppointmentRepository();
const availabilityRepository = new PrismaAvailabilityRepository();
const userRepository = new PrismaUserRepository();

const reserveAppointmentUseCase = new ReserveAppointmentUseCase(availabilityRepository, appointmentRepository);
const getMyAppointmentsUseCase = new GetMyAppointmentsUseCase(appointmentRepository, userRepository);

const appointmentController = new AppointmentController(
    reserveAppointmentUseCase,
    getMyAppointmentsUseCase,
    userRepository
);

// --- Rutas ---

// Reservar una cita (solo para Clientes)
router.post(
    '/',
    authMiddleware([UserRole.CLIENTE]),
    (req, res) => appointmentController.reserve(req, res)
);

// Ver mis citas (solo para Clientes)
router.get(
    '/my-appointments',
    authMiddleware([UserRole.CLIENTE]),
    (req, res) => appointmentController.getMine(req, res)
);

export default router;