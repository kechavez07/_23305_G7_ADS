import { Request, Response } from "express";
import { IUseCase } from "../../../application/use-cases/iuse-case";
import { CreateSpecialistDto, UpdateSpecialistDto } from "../../../application/dtos/specialist.dtos";
import { CreateSpecialistUseCase } from "../../../application/use-cases/specialist/create-specialist.use-case";
import { GetAllSpecialistsUseCase } from "../../../application/use-cases/specialist/get-all-specialists.use-case";
import { GetSpecialistByIdUseCase } from "../../../application/use-cases/specialist/get-specialist-by-id.use-case";
import { UpdateSpecialistUseCase } from "../../../application/use-cases/specialist/update-specialist.use-case";
import { DeactivateSpecialistUseCase } from "../../../application/use-cases/specialist/deactivate-specialist.use-case";
import { CreateSpecialistSchema, UpdateSpecialistSchema } from "../../../application/dtos/specialist.dtos";
import { z } from 'zod';
import { User } from "@prisma/client";
import { FullSpecialistProfile } from "../../../domain/repositories/specialist.repository";
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'; 

// Helper para omitir la contraseña de los perfiles
const omitPassword = (user: any) => {
    if (!user) return null;
    if (Array.isArray(user)) {
        return user.map(u => {
            const { password_hash, ...rest } = u;
            return rest;
        });
    }
    const { password_hash, ...rest } = user;
    return rest;
};

export class SpecialistController {
  constructor(
     private readonly createSpecialistUseCase: IUseCase<CreateSpecialistDto, Omit<User, "password_hash">>,
    private readonly getAllSpecialistsUseCase: IUseCase<any, Omit<FullSpecialistProfile, "password_hash">[]>,
    private readonly getSpecialistByIdUseCase: IUseCase<{ id: string }, Omit<FullSpecialistProfile, "password_hash">>,
    private readonly updateSpecialistUseCase: IUseCase<{ id: string, data: UpdateSpecialistDto }, Omit<FullSpecialistProfile, "password_hash">>,
    private readonly deactivateSpecialistUseCase: IUseCase<{ id: string }, Omit<User, "password_hash">>
  ) {}

  async create(req: Request, res: Response): Promise<void> {
    try {
      const data = CreateSpecialistSchema.parse(req.body);

      const specialist = await this.createSpecialistUseCase.execute(data);
      
      res.status(201).json(omitPassword(specialist));
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Datos inválidos.", errors: error.errors });
        return;
      }
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
        // 'target' usualmente nos dice qué campo falló
        const field = (error.meta?.target as string[])?.[0] || 'campo';
        let friendlyMessage = `El valor del campo '${field}' ya existe.`;

        if (field === 'email') {
          friendlyMessage = "El correo electrónico ya está en uso.";
        } else if (field === 'phone_number') {
          friendlyMessage = "El número de teléfono ya está en uso.";
        }
        
        res.status(409).json({ message: friendlyMessage });
        return;
      }
      
      // Para cualquier otro error (como el que lanzamos desde el caso de uso)
      res.status(400).json({ message: error.message });
    
    }
  }

   async getAll(req: Request, res: Response): Promise<void> {
    try {
      // Leemos el parámetro de consulta 'include_inactive' de la URL.
      const includeInactive = req.query.include_inactive === 'true';

      // Pasamos la opción al caso de uso.
      const specialists = await this.getAllSpecialistsUseCase.execute({ includeInactive });
      
      res.status(200).json(omitPassword(specialists));
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = z.object({ id: z.string().uuid() }).parse(req.params);
      const specialist = await this.getSpecialistByIdUseCase.execute({id});
      res.status(200).json(omitPassword(specialist));
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = z.object({ id: z.string().uuid() }).parse(req.params);
      const data = UpdateSpecialistSchema.parse(req.body);
      const specialist = await this.updateSpecialistUseCase.execute({ id, data });
      res.status(200).json(omitPassword(specialist));
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  }

  async deactivate(req: Request, res: Response): Promise<void> {
    try {
      const { id } = z.object({ id: z.string().uuid() }).parse(req.params);
      await this.deactivateSpecialistUseCase.execute({id});
      res.status(200).json({ message: "Especialista desactivado correctamente." });
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  }
}