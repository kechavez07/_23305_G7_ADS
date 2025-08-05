import { ISpecialistRepository } from "../../../domain/repositories/specialist.repository";


interface GetAllSpecialistsOptions {
    includeInactive?: boolean;
}

export class GetAllSpecialistsUseCase {
  constructor(private readonly specialistRepository: ISpecialistRepository) {}
  async execute(options: GetAllSpecialistsOptions = {}) {
    const { includeInactive = false } = options;
    
    // Si includeInactive es true, pasamos 'false' a la opción 'onlyActive' del repositorio.
    // Si es false, pasamos 'true' (o nada, ya que es el valor por defecto).
    return this.specialistRepository.findAll(!includeInactive);
  }
}