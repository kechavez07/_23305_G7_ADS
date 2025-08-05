import { Request, Response } from 'express';
import { RegisterUserUseCase } from '../../../application/use-cases/auth/register-user.use-case';
import { LoginUserUseCase } from '../../../application/use-cases/auth/login-user.use-case'; 

import { RegisterUserSchema, LoginUserSchema } from '../../../application/dtos/auth.dtos';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'; // <-- 1. IMPORTA

export class AuthController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly loginUserUseCase: LoginUserUseCase

    
    ) {}

   async register(req: Request, res: Response): Promise<Response> {
    try {
      const validatedData = RegisterUserSchema.parse(req.body);
      const newUser = await this.registerUserUseCase.execute(validatedData);
      return res.status(201).json(newUser);
    } catch (error: any) {
      // Si el error es de validación de Zod
      if (error.errors) {
        return res.status(400).json({ message: "Datos inválidos", errors: error.errors });
      }

      // 2. DETECTA EL ERROR DE RESTRICCIÓN ÚNICA DE PRISMA
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
        const field = (error.meta?.target as string[])?.[0] || 'campo';
        let friendlyMessage = `Ya existe un registro con este valor en el campo '${field}'.`;
        if (field === 'email') {
          friendlyMessage = "El correo electrónico ya está en uso.";
        } else if (field === 'phone_number') {
          friendlyMessage = "El número de teléfono ya está en uso.";
        }
        return res.status(409).json({ message: friendlyMessage });
      }
      
      // Para cualquier otro error (ej. el que lanzamos nosotros si el email existe)
      return res.status(409).json({ message: error.message });
    }
  }


   async login(req: Request, res: Response): Promise<Response> {
    try {
      const validatedData = LoginUserSchema.parse(req.body);
      const result = await this.loginUserUseCase.execute(validatedData);
      return res.status(200).json(result);
    } catch (error: any) {
      if (error.errors) {
        return res.status(400).json({ message: "Datos inválidos", errors: error.errors });
      }
      // Para errores de credenciales, usamos 401 Unauthorized
      return res.status(401).json({ message: error.message });
    }
  }




}