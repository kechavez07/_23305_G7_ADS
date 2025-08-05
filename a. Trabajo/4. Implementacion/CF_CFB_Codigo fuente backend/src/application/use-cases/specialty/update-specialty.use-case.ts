import { ISpecialtyRepository } from "../../../domain/repositories/specialty.repository";
import { UpdateSpecialtyDto } from "../../dtos/specialty.dtos";

export class UpdateSpecialtyUseCase {
  constructor(private readonly specialtyRepository: ISpecialtyRepository) {}

  async execute(id: string, dto: UpdateSpecialtyDto) {
    // 1. Verificar que la especialidad exista
    const existingSpecialty = await this.specialtyRepository.findById(id);
    if (!existingSpecialty) {
      throw new Error("Especialidad no encontrada.");
    }

    // 2. Si se está cambiando el nombre, verificar que no exista ya en otra especialidad
    if (dto.name && dto.name !== existingSpecialty.name) {
      const specialtyWithNewName = await this.specialtyRepository.findByName(dto.name);
      if (specialtyWithNewName) {
        throw new Error("Ya existe otra especialidad con ese nombre.");
      }
    }
    
    // 3. Ejecutar la actualización
    return this.specialtyRepository.update(id, dto);
  }
}