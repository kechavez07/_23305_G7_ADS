import { IAvailabilityRepository } from "../../../domain/repositories/availability.repository";
import { IAppointmentRepository } from "../../../domain/repositories/appointment.repository";

interface ReserveAppointmentInput {
    availabilityId: string;
    patientId: string;
}

export class ReserveAppointmentUseCase {
  constructor(
    private readonly availabilityRepository: IAvailabilityRepository,
    private readonly appointmentRepository: IAppointmentRepository
  ) {}

  async execute(input: ReserveAppointmentInput) {
    const { availabilityId, patientId } = input;

    // 1. Verificar que el bloque de disponibilidad exista
    const availability = await this.availabilityRepository.findById(availabilityId);
    if (!availability) {
      throw new Error("El horario seleccionado no existe.");
    }

    // 2. Verificar que el bloque no esté ya reservado (Doble chequeo, la transacción es la garantía final)
    if (availability.is_booked) {
      throw new Error("Este horario ya no está disponible. Por favor, seleccione otro.");
    }
    
    // 3. Crear la cita. El repositorio se encargará de la transacción.
    const newAppointment = await this.appointmentRepository.create(
        {
            patient_id: patientId,
            specialist_id: availability.specialist_id
        },
        availabilityId
    );

    return newAppointment;
  }
}