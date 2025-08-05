import { ISpecialistRepository } from "../../../domain/repositories/specialist.repository";

interface GetSpecialistByIdInput {
  id: string;
}


export class GetSpecialistByIdUseCase {
  constructor(private readonly specialistRepository: ISpecialistRepository) {}
 async execute(input: GetSpecialistByIdInput) {
    const { id } = input;
    const specialist = await this.specialistRepository.findById(id);
    if (!specialist) {
      throw new Error("Especialista no encontrado.");
    }
    return specialist;
  }
}