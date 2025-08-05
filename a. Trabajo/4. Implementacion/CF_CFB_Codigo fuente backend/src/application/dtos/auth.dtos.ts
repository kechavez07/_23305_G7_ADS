import {z} from 'zod';

// Esquema de validación para el registro de un nuevo usuario.
export const RegisterUserSchema = z.object({
  email: z.string().email({ message: "El correo electrónico no es válido." }),
  //password: z.string().min(8, { message: "La contraseña debe tener al menos 8 caracteres." }),
  full_name: z.string().min(3, { message: "El nombre completo es requerido." }),
  phone_number: z.string().length(10, { message: "El número de teléfono debe tener 10 dígitos." }),
  patient: z.object({
    full_name: z.string().min(3, { message: "El nombre del paciente es requerido." }),
    age: z.number().int().positive({ message: "La edad debe ser un número positivo." }),
    gender: z.enum(['MASCULINO', 'FEMENINO', 'OTRO']).optional(),
    condition: z.string().optional(),
  })
});

// Extraemos el tipo de TypeScript a partir del esquema de Zod.
export type RegisterUserDto = z.infer<typeof RegisterUserSchema>;


// Esquema de validación para el inicio de sesión.
export const LoginUserSchema = z.object({
  email: z.string().email({ message: "El correo electrónico no es válido." }),
  password: z.string().min(1, { message: "La contraseña es requerida." }), // Solo validamos que no esté vacío
});

// Tipo del DTO de Login
export type LoginUserDto = z.infer<typeof LoginUserSchema>;