import { z } from 'zod';

export const CreateAvailabilitySchema = z.object({
  specialist_id: z.string().uuid().optional(), // Opcional, solo para Admins
  start_time: z.string().datetime({ message: "La fecha de inicio debe ser un formato ISO 8601 válido." }),
  end_time: z.string().datetime({ message: "La fecha de fin debe ser un formato ISO 8601 válido." }),
}).refine(data => new Date(data.start_time) < new Date(data.end_time), {
  message: "La fecha de fin debe ser posterior a la fecha de inicio.",
  path: ["end_time"], // Asocia el error al campo end_time
});


export type CreateAvailabilityDto = z.infer<typeof CreateAvailabilitySchema>;

export const UpdateAvailabilitySchema = z.object({
  start_time: z.string().datetime().optional(),
  end_time: z.string().datetime().optional(),
}).refine(data => {
  // Si ambas fechas están presentes, la de fin debe ser mayor
  if (data.start_time && data.end_time) {
    return new Date(data.start_time) < new Date(data.end_time);
  }
  return true; // Si solo una (o ninguna) está presente, la validación pasa
}, {
  message: "La fecha de fin debe ser posterior a la fecha de inicio.",
  path: ["end_time"],
});

export type UpdateAvailabilityDto = z.infer<typeof UpdateAvailabilitySchema>;


const TimeSlotSchema = z.object({
  start: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "El formato de hora debe ser HH:mm"),
  end: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "El formato de hora debe ser HH:mm"),
}).refine(data => data.start < data.end, {
    message: "La hora de fin debe ser posterior a la de inicio.",
    path: ["end"],
});


// Esquema para el objeto de horario semanal
const WeeklyScheduleSchema = z.object({
  lunes: z.array(TimeSlotSchema).optional(),
  martes: z.array(TimeSlotSchema).optional(),
  miercoles: z.array(TimeSlotSchema).optional(),
  jueves: z.array(TimeSlotSchema).optional(),
  viernes: z.array(TimeSlotSchema).optional(),
  sabado: z.array(TimeSlotSchema).optional(),
  domingo: z.array(TimeSlotSchema).optional(),
});

// Esquema principal para la petición
export const CreateWeeklyScheduleSchema = z.object({
  specialist_id: z.string().uuid().optional(),
  schedule: WeeklyScheduleSchema,
});

export type CreateWeeklyScheduleDto = z.infer<typeof CreateWeeklyScheduleSchema>;




