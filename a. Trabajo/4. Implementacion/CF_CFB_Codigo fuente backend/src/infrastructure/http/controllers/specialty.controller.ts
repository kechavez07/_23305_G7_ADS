// src/infrastructure/http/controllers/specialty.controller.ts

import { Request, Response } from "express";
import { CreateSpecialtyUseCase } from "../../../application/use-cases/specialty/create-specialty.use-case";
import { GetAllSpecialtiesUseCase } from "../../../application/use-cases/specialty/get-all-specialties.use-case";
import { DeactivateSpecialtyUseCase } from "../../../application/use-cases/specialty/deactivate-specialty.use-case";
import { CreateSpecialtySchema ,UpdateSpecialtySchema  } from "../../../application/dtos/specialty.dtos";
import { UpdateSpecialtyUseCase } from "../../../application/use-cases/specialty/update-specialty.use-case";
import { GetSpecialtyByIdUseCase } from "../../../application/use-cases/specialty/get-specialty-by-id.use-case";
import { z } from 'zod'; 


export class SpecialtyController {
  constructor(
    private readonly createSpecialtyUseCase: CreateSpecialtyUseCase,
    private readonly getAllSpecialtiesUseCase: GetAllSpecialtiesUseCase,
    private readonly deactivateSpecialtyUseCase: DeactivateSpecialtyUseCase,
    private readonly updateSpecialtyUseCase: UpdateSpecialtyUseCase,
    private readonly getSpecialtyByIdUseCase: GetSpecialtyByIdUseCase
  ) {}

  async create(req: Request, res: Response) {
    try {
      const data = CreateSpecialtySchema.parse(req.body);
      const specialty = await this.createSpecialtyUseCase.execute(data);
      res.status(201).json(specialty);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

    async getAll(req: Request, res: Response): Promise<void> {
    try {
      // Leemos el parámetro de consulta 'include_inactive' de la URL.
      // req.query contiene todos los parámetros después del '?'.
      // Lo convertimos a booleano. Si no está presente, será 'false'.
      const includeInactive = req.query.include_inactive === 'true';

      // Pasamos la opción al caso de uso.
      const specialties = await this.getAllSpecialtiesUseCase.execute({ includeInactive });
      
      res.status(200).json(specialties);
    } catch (error: any) {
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
        const paramsSchema = z.object({ id: z.string().uuid() });
        const { id } = paramsSchema.parse(req.params);

        const specialty = await this.getSpecialtyByIdUseCase.execute(id);
        res.status(200).json(specialty);

    } catch (error: any) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ message: "ID de especialidad inválido.", errors: error.errors });
            return;
        }
        res.status(404).json({ message: error.message });
    }
  }

   async deactivate(req: Request, res: Response): Promise<void> {
    try {
      const paramsSchema = z.object({
        id: z.string().uuid({ message: "El ID de la especialidad debe ser un UUID válido." })
      });
      const { id } = paramsSchema.parse(req.params);

      await this.deactivateSpecialtyUseCase.execute(id);

      res.status(200).json({ message: "Especialidad desactivada de forma correcta." });

    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Datos inválidos.", errors: error.errors });
        return;
      }
      res.status(error.message.includes("encontrada") ? 404 : 400).json({ message: error.message });
    }
  }

   async update(req: Request, res: Response): Promise<void> {
    try {
      const paramsSchema = z.object({ id: z.string().uuid() });
      const { id } = paramsSchema.parse(req.params);
      const data = UpdateSpecialtySchema.parse(req.body);

      const updatedSpecialty = await this.updateSpecialtyUseCase.execute(id, data);
      res.status(200).json(updatedSpecialty);

    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Datos inválidos.", errors: error.errors });
        return;
      }
      // Puede ser 404 (no encontrada) o 400 (nombre duplicado)
      res.status(error.message.includes("encontrada") ? 404 : 400).json({ message: error.message });
    }
  }




}