import { ISpecialtyRepository } from "../../../domain/repositories/specialty.repository";

export class GetSpecialtyByIdUseCase {
  constructor(private readonly specialtyRepository: ISpecialtyRepository) {}

  async execute(id: string) {
    const specialty = await this.specialtyRepository.findById(id);
    
    if (!specialty) {
      throw new Error("Especialidad no encontrada.");
    }

    // Opcional: si solo los activos deben ser encontrados por ID
    // if (!specialty || !specialty.is_active) {
    //   throw new Error("Especialidad no encontrada o inactiva.");
    // }

    return specialty;
  }
}