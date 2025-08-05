import { ISpecialtyRepository } from "../../../../domain/repositories/specialty.repository";
import { CreateSpecialtyDto } from "../../../../application/dtos/specialty.dtos";
import { Specialty } from "@prisma/client";
import { UpdateSpecialtyDto } from "../../../../application/dtos/specialty.dtos"; 
import prisma from "../prisma.service";

export class PrismaSpecialtyRepository implements ISpecialtyRepository {

    async create(data: CreateSpecialtyDto): Promise<Specialty> {
        return prisma.specialty.create({ data });
    }
    
    // La firma del método es: findAll(onlyActive: boolean = true)
    // `onlyActive = true` es el valor por defecto si no se pasa nada.
    async findAll(onlyActive: boolean = true): Promise<Specialty[]> {
    // Si onlyActive es true, añadimos la cláusula where.
    // Si es false, la cláusula where es un objeto vacío, por lo que trae todo.
    const whereClause = onlyActive ? { is_active: true } : {};
    return prisma.specialty.findMany({ 
        where: whereClause ,
        orderBy: {
            created_at: 'desc' // Opcional: ordenar por fecha de creación
        }
    });
  }
    async findByName(name: string): Promise<Specialty | null> {
        return prisma.specialty.findUnique({ where: { name } });
    }
    async findById(id: string): Promise<Specialty | null> {
        return prisma.specialty.findUnique({ where: { id } });
    }
    async update(id: string, data: UpdateSpecialtyDto): Promise<Specialty> {
    return prisma.specialty.update({
      where: { id },
      data, 
    });
    }
    async deactivate(id: string): Promise<Specialty> {
    return prisma.specialty.update({
      where: { id },
      data: { is_active: false }, // La lógica clave: cambiamos el estado
    });
    }
}