import { IUserRepository } from "../../../../domain/repositories/user.repository";
import { RegisterUserDto } from "../../../../application/dtos/auth.dtos";
import { User , Patient } from "@prisma/client";
import prisma from "../prisma.service";

// Esta es la implementación concreta de la interfaz IUserRepository usando Prisma.
export class PrismaUserRepository implements IUserRepository {
  async create(userData: RegisterUserDto & { password_hash: string }): Promise<Omit<User, "password_hash">> {
    // Usamos una transacción de Prisma para asegurar que tanto el usuario como el paciente se creen correctamente.
    const newUser = await prisma.user.create({
      data: {
        email: userData.email,
        full_name: userData.full_name,
        password_hash: userData.password_hash,
        phone_number: userData.phone_number,
        role: 'CLIENTE', // Rol por defecto para el registro
        representative_for: {
          create: {
            full_name: userData.patient.full_name,
            age: userData.patient.age,
            gender: userData.patient.gender,
            condition: userData.patient.condition,
          }
        }
      },
      select: { // Seleccionamos los campos a devolver, excluyendo la contraseña
        id: true,
        email: true,
        full_name: true,
        phone_number: true,
        role: true,
        is_active: true,
        created_at: true,
        updated_at: true,
      }
    });
    return newUser;
  }

  async findByEmail(email: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { email },
    });
  }

   async findById(id: string): Promise<(User & { representative_for: Patient[] }) | null> {
    return prisma.user.findUnique({
        where: { id },
        include: { representative_for: true }
    });
  }


}