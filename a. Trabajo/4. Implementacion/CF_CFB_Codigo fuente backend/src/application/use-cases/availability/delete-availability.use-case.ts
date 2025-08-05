import { IAvailabilityRepository } from "../../../domain/repositories/availability.repository";

export class DeleteAvailabilityUseCase {
  constructor(private readonly availabilityRepository: IAvailabilityRepository) {}

  async execute(availabilityId: string) {
    // 1. Verificar que el bloque exista
    const availability = await this.availabilityRepository.findById(availabilityId);
    if (!availability) {
      throw new Error("Bloque de disponibilidad no encontrado.");
    }

    // 2. Verificar que no esté ya reservado
    if (availability.is_booked) {
      throw new Error("No se puede eliminar un horario que ya tiene una cita agendada.");
    }

    // 3. Proceder con la eliminación
    return this.availabilityRepository.delete(availabilityId);
  }
}