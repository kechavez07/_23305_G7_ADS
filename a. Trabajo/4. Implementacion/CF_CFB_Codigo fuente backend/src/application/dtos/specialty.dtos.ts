import { z } from 'zod';

export const CreateSpecialtySchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres."),
  description: z.string().optional(),
});

export type CreateSpecialtyDto = z.infer<typeof CreateSpecialtySchema>;

export const UpdateSpecialtySchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres.").optional(),
  description: z.string().optional(),
});

export type UpdateSpecialtyDto = z.infer<typeof UpdateSpecialtySchema>;