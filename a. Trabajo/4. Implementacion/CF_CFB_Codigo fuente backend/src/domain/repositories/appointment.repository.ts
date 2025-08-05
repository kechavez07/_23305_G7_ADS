import { Appointment } from "@prisma/client";
import { CreateAppointmentDto } from "../../application/dtos/appointment.dtos";


export interface IAppointmentRepository {
  /**
   * Crea una nueva cita en una transacción.
   * @param data - Contiene patient_id y specialist_id.
   * @param availabilityId - ID del bloque de disponibilidad a bloquear.
   * @returns La cita creada.
   */
  create(data: CreateAppointmentDto, availabilityId: string): Promise<Appointment>;

  /**
   * Encuentra todas las citas de un paciente.
   * @param patientId - ID del paciente.
   * @returns Un array de citas.
   */
  findManyByPatientId(patientId: string): Promise<Appointment[]>;
}