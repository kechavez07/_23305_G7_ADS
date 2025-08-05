import { ISpecialtyRepository } from "../../../domain/repositories/specialty.repository";
import { CreateSpecialtyDto } from "../../dtos/specialty.dtos";

export class CreateSpecialtyUseCase {
  constructor(private readonly specialtyRepository: ISpecialtyRepository) {}

  async execute(dto: CreateSpecialtyDto) {
    const existingSpecialty = await this.specialtyRepository.findByName(dto.name);
    if (existingSpecialty) {
      throw new Error("Ya existe una especialidad con este nombre.");
    }
    return this.specialtyRepository.create(dto);
  }
}