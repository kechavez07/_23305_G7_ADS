import { Request, Response } from "express";
import { CreateAvailabilityUseCase } from "../../../application/use-cases/availability/create-availability.use-case";
import { GetAvailabilitiesBySpecialistUseCase } from "../../../application/use-cases/availability/get-availabilities-by-specialist.use-case";
import { DeleteAvailabilityUseCase } from "../../../application/use-cases/availability/delete-availability.use-case";
import { CreateAvailabilitySchema } from "../../../application/dtos/availability.dtos";
import { IAvailabilityRepository } from "../../../domain/repositories/availability.repository";
import { UpdateAvailabilityUseCase } from "../../../application/use-cases/availability/update-availability.use-case";
import { UpdateAvailabilitySchema } from "../../../application/dtos/availability.dtos"; 
import { UserRole } from "@prisma/client";
import { CreateWeeklyScheduleUseCase } from "../../../application/use-cases/availability/create-weekly-schedule.use-case";
import { CreateWeeklyScheduleSchema } from "../../../application/dtos/availability.dtos";
import { z } from "zod";

export class AvailabilityController {
  constructor(
    private readonly createAvailabilityUseCase: CreateAvailabilityUseCase,
    private readonly getAvailabilitiesBySpecialistUseCase: GetAvailabilitiesBySpecialistUseCase,
    private readonly deleteAvailabilityUseCase: DeleteAvailabilityUseCase,
    private readonly updateAvailabilityUseCase: UpdateAvailabilityUseCase,
    private readonly availabilityRepository: IAvailabilityRepository, // Inyectamos el repo para una validación
    private readonly createWeeklyScheduleUseCase: CreateWeeklyScheduleUseCase,
  ) {}

  async create(req: Request, res: Response): Promise<void> {
    try {
      const data = CreateAvailabilitySchema.parse(req.body);
      
      // Lógica de permisos
      if (req.user?.role === 'ESPECIALISTA') {
        // Si es especialista, no puede definir el ID de otro.
        if (data.specialist_id && data.specialist_id !== req.user.id) {
            res.status(403).json({ message: "No tienes permiso para crear disponibilidad para otro especialista." });
            return;
        }
        // Asigna su propio ID si no viene en el body
        data.specialist_id = req.user.id;
      }
      
      if (req.user?.role === 'ADMIN' && !data.specialist_id) {
          res.status(400).json({ message: "Como administrador, debes especificar el 'specialist_id'." });
          return;
      }

      const availability = await this.createAvailabilityUseCase.execute(data as any);
      res.status(201).json(availability);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Datos inválidos.", errors: error.errors });
      } else {
        res.status(409).json({ message: error.message }); // 409 Conflict para solapamientos
      }
    }
  }

  async getBySpecialist(req: Request, res: Response): Promise<void> {
    try {
      const { specialistId } = z.object({ specialistId: z.string().uuid() }).parse(req.params);
      const { start, end } = z.object({ start: z.string().datetime(), end: z.string().datetime() }).parse(req.query);

      const availabilities = await this.getAvailabilitiesBySpecialistUseCase.execute(specialistId, new Date(start), new Date(end));
      res.status(200).json(availabilities);
    } catch (error: any) {
        res.status(400).json({ message: "Parámetros inválidos.", errors: (error as z.ZodError).errors });
    }
  }

   async update(req: Request, res: Response): Promise<void> {
    try {
        const { id } = z.object({ id: z.string().uuid() }).parse(req.params);
        const data = UpdateAvailabilitySchema.parse(req.body);

        // Lógica de permisos similar al borrado
        const availabilityToUpdate = await this.availabilityRepository.findById(id);
        if (!availabilityToUpdate) {
            res.status(404).json({ message: "Bloque de disponibilidad no encontrado." });
            return;
        }

        if (req.user?.role === 'ESPECIALISTA' && availabilityToUpdate.specialist_id !== req.user.id) {
            res.status(403).json({ message: "No tienes permiso para modificar este bloque de disponibilidad." });
            return;
        }
        
        const updatedAvailability = await this.updateAvailabilityUseCase.execute(id, data);
        res.status(200).json(updatedAvailability);

    } catch (error: any) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ message: "Datos inválidos.", errors: error.errors });
        } else {
            res.status(error.message.includes("encontrado") ? 404 : 409).json({ message: error.message });
        }
    }
  }



  async delete(req: Request, res: Response): Promise<void> {
    try {
        const { id } = z.object({ id: z.string().uuid() }).parse(req.params);

        // Lógica de permisos para borrado
        const availabilityToDelete = await this.availabilityRepository.findById(id);
        if (!availabilityToDelete) {
            res.status(404).json({ message: "Bloque de disponibilidad no encontrado." });
            return;
        }

        if (req.user?.role === 'ESPECIALISTA' && availabilityToDelete.specialist_id !== req.user.id) {
            res.status(403).json({ message: "No tienes permiso para eliminar este bloque de disponibilidad." });
            return;
        }

        await this.deleteAvailabilityUseCase.execute(id);
        res.status(200).json({ message: "Bloque de disponibilidad eliminado correctamente." });
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ message: "ID de disponibilidad inválido.", errors: error.errors });
        } else {
            res.status(409).json({ message: error.message }); // 409 Conflict si ya está reservado
        }
    }
  }


  async createWeeklySchedule(req: Request, res: Response): Promise<void> {
    try {
        let data = CreateWeeklyScheduleSchema.parse(req.body);
        
        // Lógica de permisos similar a la creación individual
        if (req.user?.role === 'ESPECIALISTA') {
            if (data.specialist_id && data.specialist_id !== req.user.id) {
                res.status(403).json({ message: "No tienes permiso para crear horarios para otro especialista." });
                return;
            }
            data.specialist_id = req.user.id;
        }

        if (req.user?.role === 'ADMIN' && !data.specialist_id) {
            res.status(400).json({ message: "Como administrador, debes especificar el 'specialist_id'." });
            return;
        }

        const result = await this.createWeeklyScheduleUseCase.execute(data);
        res.status(201).json({ message: `Se crearon ${result.count} nuevos bloques de disponibilidad exitosamente.` });

    } catch (error: any) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ message: "Datos inválidos.", errors: error.errors });
        } else {
            res.status(409).json({ message: error.message });
        }
    }
  }


}