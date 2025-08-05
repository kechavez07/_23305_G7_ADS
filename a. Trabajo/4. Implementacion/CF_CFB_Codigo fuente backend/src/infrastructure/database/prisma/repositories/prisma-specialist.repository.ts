import { ISpecialistRepository, FullSpecialistProfile } from "../../../../domain/repositories/specialist.repository";
import { CreateSpecialistDto, UpdateSpecialistDto } from "../../../../application/dtos/specialist.dtos";
import { User } from "@prisma/client";
import prisma from "../prisma.service";

export class PrismaSpecialistRepository implements ISpecialistRepository {
 async create(data: CreateSpecialistDto & { password_hash: string }): Promise<Omit<FullSpecialistProfile, "password_hash">> {
    // 1. Ejecuta la creación del usuario con 'include' para traer el perfil del especialista
    const newUserWithProfile = await prisma.user.create({
      data: {
        email: data.email,
        full_name: data.full_name,
        password_hash: data.password_hash,
        phone_number: data.phone_number,
        role: 'ESPECIALISTA',
        specialist_profile: {
          create: {
            title: data.title,
            specialty_id: data.specialty_id
          }
        }
      },
      // CAMBIO CLAVE: Usamos 'include' en lugar de 'select'
      include: {
        specialist_profile: true // Esto le dice a Prisma que traiga el perfil relacionado
      }
    });

    // 2. Omitimos manualmente la contraseña del objeto resultante antes de devolverlo
    const { password_hash, ...specialistProfile } = newUserWithProfile;

    // 3. Devolvemos el perfil completo y seguro
    return specialistProfile;
}

  async findAll(onlyActive: boolean = true): Promise<Omit<FullSpecialistProfile, "password_hash">[]> {
    
    const whereClause: any = {
      role: 'ESPECIALISTA'
    };

    if (onlyActive) {
      whereClause.is_active = true;
    }

    const users = await prisma.user.findMany({
      where: whereClause, // Usamos la cláusula construida
      include: {
        specialist_profile: true
      },
      orderBy: {
        full_name: 'asc' // Opcional: ordenar alfabéticamente
      }
    });

    // El mapeo para omitir la contraseña no cambia
    return users.map(user => {
      const { password_hash, ...rest } = user;
      return rest;
    });
    
    
  }

  async findById(id: string): Promise<Omit<FullSpecialistProfile, "password_hash"> | null> {
    const user = await prisma.user.findUnique({
      where: { id, role: 'ESPECIALISTA' },
      include: { specialist_profile: true }
    });
    if (user) {
      const { password_hash, ...rest } = user;
      return rest;
    }
    return null;
  }

  async update(id: string, data: UpdateSpecialistDto): Promise<Omit<FullSpecialistProfile, "password_hash">> {
    const { is_active, full_name, phone_number, ...specialistData } = data;
    
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        is_active,
        full_name,
        phone_number,
        specialist_profile: {
          update: specialistData
        }
      },
      include: { specialist_profile: true }
    });

    const { password_hash, ...rest } = updatedUser;
    return rest;
  }

  async deactivate(id: string): Promise<Omit<User, "password_hash">> {
    return prisma.user.update({
      where: { id },
      data: { is_active: false },
       select: {
        id: true,
        email: true,
        full_name: true,
        phone_number: true,
        role: true,
        is_active: true, // Importante para confirmar que el cambio se aplicó
        created_at: true,
        updated_at: true
      }
    });
  }
}