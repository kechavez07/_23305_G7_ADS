import { ISpecialistRepository } from "../../../domain/repositories/specialist.repository";
import { UpdateSpecialistDto } from "../../dtos/specialist.dtos";


interface UpdateSpecialistInput {
  id: string;
  data: UpdateSpecialistDto;
}


export class UpdateSpecialistUseCase {
  constructor(private readonly specialistRepository: ISpecialistRepository) {}
    async execute(input: UpdateSpecialistInput) {
    const { id, data } = input;
    const specialist = await this.specialistRepository.findById(id);
    if (!specialist) {
      throw new Error("Especialista no encontrado.");
    }
    return this.specialistRepository.update(id, data);
  }
}