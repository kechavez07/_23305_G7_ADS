import { IAvailabilityRepository } from "../../../../domain/repositories/availability.repository";
import { CreateAvailabilityDto } from "../../../../application/dtos/availability.dtos";
import { UpdateAvailabilityDto } from "../../../../application/dtos/availability.dtos"; 
import { Availability } from "@prisma/client";
import prisma from "../prisma.service";

export class PrismaAvailabilityRepository implements IAvailabilityRepository {
  async create(data: CreateAvailabilityDto): Promise<Availability> {
    return prisma.availability.create({
      data: {
        specialist_id: data.specialist_id!,
        start_time: new Date(data.start_time),
        end_time: new Date(data.end_time),
      }
    });
  }

  async findManyBySpecialistId(specialistId: string, startDate: Date, endDate: Date): Promise<Availability[]> {
    return prisma.availability.findMany({
      where: {
        specialist_id: specialistId,
        // Lógica para encontrar solapamientos o rangos.
        // Un bloque está en el rango si:
        // (su inicio es antes del fin del rango) Y (su fin es después del inicio del rango)
        start_time: {
          lt: endDate,
        },
        end_time: {
          gt: startDate,
        }
      },
      orderBy: {
        start_time: 'asc',
      }
    });
  }

  async findById(id: string): Promise<Availability | null> {
    return prisma.availability.findUnique({ where: { id } });
  }

   async update(id: string, data: UpdateAvailabilityDto): Promise<Availability> {
    return prisma.availability.update({
      where: { id },
      data: {
        start_time: data.start_time ? new Date(data.start_time) : undefined,
        end_time: data.end_time ? new Date(data.end_time) : undefined,
      },
    });
  }


  async delete(id: string): Promise<Availability> {
    return prisma.availability.delete({ where: { id } });
  }


   async createMany(data: { specialist_id: string; start_time: Date; end_time: Date; }[]): Promise<{ count: number; }> {
    // Prisma createMany es altamente eficiente para inserciones masivas.
    // Se ejecuta como una única transacción por defecto.
    return prisma.availability.createMany({
      data: data,
      skipDuplicates: true, // Importante: si un horario idéntico ya existe, simplemente lo ignora.
    });
  }

  
}