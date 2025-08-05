import { IAvailabilityRepository } from "../../../domain/repositories/availability.repository";
import { CreateAvailabilityDto } from "../../dtos/availability.dtos";

export class CreateAvailabilityUseCase {
  constructor(private readonly availabilityRepository: IAvailabilityRepository) {}

  async execute(dto: CreateAvailabilityDto) {
    const { specialist_id, start_time, end_time } = dto;
    if (!specialist_id) {
        throw new Error("El ID del especialista es requerido.");
    }

    // 1. Convertir fechas a objetos Date
    const startDate = new Date(start_time);
    const endDate = new Date(end_time);

    // 2. Verificar si ya existe un bloque que se solape con el nuevo
    const existingAvailabilities = await this.availabilityRepository.findManyBySpecialistId(specialist_id, startDate, endDate);

    const isOverlapping = existingAvailabilities.some(existing => 
      (startDate < new Date(existing.end_time)) && (endDate > new Date(existing.start_time))
    );
    
    if (isOverlapping) {
      throw new Error("El nuevo horario se solapa con un bloque de disponibilidad existente.");
    }

    // 3. Crear el nuevo bloque de disponibilidad
    return this.availabilityRepository.create({
        specialist_id,
        start_time,
        end_time,
    });
  }
}