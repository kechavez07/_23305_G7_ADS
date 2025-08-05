import { ISpecialtyRepository } from "../../../domain/repositories/specialty.repository";


interface GetAllSpecialtiesOptions {
  includeInactive?: boolean;
}


export class GetAllSpecialtiesUseCase {
  constructor(private readonly specialtyRepository: ISpecialtyRepository) {}

   async execute(options: GetAllSpecialtiesOptions = {}) {
    const { includeInactive = false } = options;

    // Si includeInactive es true, llamamos a findAll con 'false' para obtener todas.
    // Si es false, llamamos con 'true' para obtener solo las activas.
    return this.specialtyRepository.findAll(!includeInactive);
  }
}