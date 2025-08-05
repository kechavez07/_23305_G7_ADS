import { ISpecialtyRepository } from "../../../domain/repositories/specialty.repository";

export class DeactivateSpecialtyUseCase {
  constructor(private readonly specialtyRepository: ISpecialtyRepository) {}

  async execute(id: string) {
    const specialty = await this.specialtyRepository.findById(id);
    if (!specialty) {
      throw new Error("Especialidad no encontrada.");
    }

    if (!specialty.is_active) {
      throw new Error("Esta especialidad ya se encuentra inactiva.");
    }


    // Aquí luego se agregaria la lógica para verificar si la especialidad tiene especialistas asignados antes de borrarla.
    // Por ahora, la eliminamos directamente.
    return this.specialtyRepository.deactivate(id);
  }
}