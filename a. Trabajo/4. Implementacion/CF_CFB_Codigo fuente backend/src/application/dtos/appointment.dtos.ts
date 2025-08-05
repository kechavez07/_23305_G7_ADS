import { z } from 'zod';

// DTO para el body de la petición de reserva
export const ReserveAppointmentSchema = z.object({
  availability_id: z.string().uuid({ message: "El ID de la disponibilidad es requerido y debe ser un UUID." }),
});
export type ReserveAppointmentDto = z.infer<typeof ReserveAppointmentSchema>;

// DTO interno para crear la cita, con datos del usuario y paciente
export type CreateAppointmentDto = {
  patient_id: string;
  specialist_id: string;
};