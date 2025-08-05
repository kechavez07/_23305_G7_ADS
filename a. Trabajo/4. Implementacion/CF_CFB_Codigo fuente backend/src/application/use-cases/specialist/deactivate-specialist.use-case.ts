import { ISpecialistRepository } from "../../../domain/repositories/specialist.repository";

interface DeactivateSpecialistInput {
  id: string;
}


export class DeactivateSpecialistUseCase {
  constructor(private readonly specialistRepository: ISpecialistRepository) {}
  async execute(input: DeactivateSpecialistInput) {
    const { id } = input;
    const specialist = await this.specialistRepository.findById(id);
    if (!specialist) {
      throw new Error("Especialista no encontrado.");
    }
    if (!specialist.is_active) {
      throw new Error("Este especialista ya se encuentra inactivo.");
    }
    return this.specialistRepository.deactivate(id);
  }
}