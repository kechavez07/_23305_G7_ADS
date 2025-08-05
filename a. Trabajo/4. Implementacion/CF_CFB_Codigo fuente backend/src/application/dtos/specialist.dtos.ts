import { z } from 'zod';

// Esquema para crear un nuevo especialista.
export const CreateSpecialistSchema = z.object({
  email: z.string().email(),
  full_name: z.string().min(3),
  phone_number: z.string().length(10),
  specialty_id: z.string().uuid(),
  title: z.string().optional(),
});
export type CreateSpecialistDto = z.infer<typeof CreateSpecialistSchema>;

// Esquema para actualizar un especialista. Todos los campos son opcionales.
export const UpdateSpecialistSchema = z.object({
  full_name: z.string().min(3).optional(),
  phone_number: z.string().length(10).optional(),
  specialty_id: z.string().uuid().optional(),
  title: z.string().optional(),
  is_active: z.boolean().optional(),
});
export type UpdateSpecialistDto = z.infer<typeof UpdateSpecialistSchema>;