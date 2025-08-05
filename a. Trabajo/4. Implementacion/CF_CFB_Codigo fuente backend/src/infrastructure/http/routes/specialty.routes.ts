// src/infrastructure/http/routes/specialty.routes.ts

import { Router } from "express";
import { PrismaSpecialtyRepository } from "../../database/prisma/repositories/prisma-specialty.repository";
import { CreateSpecialtyUseCase } from "../../../application/use-cases/specialty/create-specialty.use-case";
import { GetAllSpecialtiesUseCase } from "../../../application/use-cases/specialty/get-all-specialties.use-case";
import { DeactivateSpecialtyUseCase } from "../../../application/use-cases/specialty/deactivate-specialty.use-case";
import { SpecialtyController } from "../controllers/specialty.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { UpdateSpecialtyUseCase } from "../../../application/use-cases/specialty/update-specialty.use-case"; 
import { UserRole } from "@prisma/client";
import { GetSpecialtyByIdUseCase } from "../../../application/use-cases/specialty/get-specialty-by-id.use-case";

const router = Router();

// --- Inyección de Dependencias ---
const specialtyRepository = new PrismaSpecialtyRepository();
const createSpecialtyUseCase = new CreateSpecialtyUseCase(specialtyRepository);
const getAllSpecialtiesUseCase = new GetAllSpecialtiesUseCase(specialtyRepository);
const deactivateSpecialtyUseCase = new DeactivateSpecialtyUseCase(specialtyRepository); const updateSpecialtyUseCase = new UpdateSpecialtyUseCase(specialtyRepository);
const getSpecialtyByIdUseCase = new GetSpecialtyByIdUseCase(specialtyRepository);

const specialtyController = new SpecialtyController(
    createSpecialtyUseCase,
    getAllSpecialtiesUseCase,
    deactivateSpecialtyUseCase,
    updateSpecialtyUseCase,
    getSpecialtyByIdUseCase
);

// --- Definición de Rutas PROTEGIDAS ---
// Todas las rutas aquí requieren un token válido y que el usuario tenga el rol 'ADMIN'.
//router.use(authMiddleware([UserRole.ADMIN])); 

router.post(
    '/', 
    authMiddleware([UserRole.ADMIN]), 
    (req, res) => specialtyController.create(req, res)
);

router.get(
    '/', 
    authMiddleware([UserRole.ADMIN, UserRole.CLIENTE, UserRole.ESPECIALISTA]), 
    (req, res) => specialtyController.getAll(req, res)
);

router.get(
    '/:id',
    authMiddleware([UserRole.ADMIN, UserRole.CLIENTE, UserRole.ESPECIALISTA]),
    (req, res) => specialtyController.getById(req, res)
);

router.delete(
    '/:id', 
    authMiddleware([UserRole.ADMIN]), 
    (req, res) => specialtyController.deactivate(req, res)
);

router.put(
    '/:id', 
    authMiddleware([UserRole.ADMIN]), 
    (req, res) => specialtyController.update(req, res)
);

export default router;