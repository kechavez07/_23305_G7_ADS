import { IAvailabilityRepository } from "../../../domain/repositories/availability.repository";
import { UpdateAvailabilityDto } from "../../dtos/availability.dtos";

export class UpdateAvailabilityUseCase {
  constructor(private readonly availabilityRepository: IAvailabilityRepository) {}

  async execute(id: string, dto: UpdateAvailabilityDto) {
    // 1. Verificar que el bloque a actualizar exista y no esté reservado
    const existingBlock = await this.availabilityRepository.findById(id);
    if (!existingBlock) {
      throw new Error("Bloque de disponibilidad no encontrado.");
    }
    if (existingBlock.is_booked) {
      throw new Error("No se puede modificar un horario que ya tiene una cita agendada.");
    }

    // 2. Definir las nuevas fechas (usando las existentes si no se proveen nuevas)
    const newStartDate = dto.start_time ? new Date(dto.start_time) : existingBlock.start_time;
    const newEndDate = dto.end_time ? new Date(dto.end_time) : existingBlock.end_time;

    // 3. Verificar solapamientos con OTROS bloques de disponibilidad
    const otherAvailabilities = await this.availabilityRepository.findManyBySpecialistId(
      existingBlock.specialist_id, 
      newStartDate, 
      newEndDate
    );

    // Filtramos para excluir el bloque que estamos editando
    const isOverlapping = otherAvailabilities
      .filter(block => block.id !== id)
      .some(otherBlock => 
        (newStartDate < otherBlock.end_time) && (newEndDate > otherBlock.start_time)
      );

    if (isOverlapping) {
      throw new Error("El horario actualizado se solapa con otro bloque de disponibilidad.");
    }
    
    // 4. Proceder con la actualización
    return this.availabilityRepository.update(id, dto);
  }
}