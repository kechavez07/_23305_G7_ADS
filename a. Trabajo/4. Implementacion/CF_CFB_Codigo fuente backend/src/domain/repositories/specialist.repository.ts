import { User, Specialist } from "@prisma/client";
import { CreateSpecialistDto, UpdateSpecialistDto } from "../../application/dtos/specialist.dtos";

// Combinamos User y Specialist para tener toda la información en un solo tipo.
export type FullSpecialistProfile = User & {
  specialist_profile: Specialist | null;
};

export interface ISpecialistRepository {
  create(data: CreateSpecialistDto & { password_hash: string }): Promise<Omit<User, 'password_hash'>>;
  findAll(onlyActive?: boolean): Promise<Omit<FullSpecialistProfile, 'password_hash'>[]>;
  findById(id: string): Promise<Omit<FullSpecialistProfile, 'password_hash'> | null>;
  update(id: string, data: UpdateSpecialistDto): Promise<Omit<FullSpecialistProfile, 'password_hash'>>;
  deactivate(id: string): Promise<Omit<User, 'password_hash'>>;
}