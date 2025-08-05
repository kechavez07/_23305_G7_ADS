import { IAppointmentRepository } from "../../../domain/repositories/appointment.repository";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { Patient } from "@prisma/client";

export class GetMyAppointmentsUseCase {
  constructor(
    private readonly appointmentRepository: IAppointmentRepository,
    private readonly userRepository: IUserRepository // Necesitamos encontrar el paciente asociado al cliente
  ) {}

  async execute(clientId: string) {
    // En nuestro modelo, un cliente (User) tiene un paciente asociado (Patient)
    // Necesitamos encontrar el ID del paciente para buscar sus citas.
    const clientUser = await this.userRepository.findById(clientId);
    if (!clientUser || !clientUser.representative_for || clientUser.representative_for.length === 0) {
        throw new Error("No se encontró un paciente asociado a este cliente.");
    }

    const patient = clientUser.representative_for[0] as Patient;
    
    return this.appointmentRepository.findManyByPatientId(patient.id);
  }
}