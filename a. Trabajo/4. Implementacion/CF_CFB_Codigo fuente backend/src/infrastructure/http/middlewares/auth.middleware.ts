// src/infrastructure/http/middlewares/auth.middleware.ts

import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { UserRole } from '@prisma/client';

// La declaración global de Express.Request no cambia.
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: UserRole;
      };
    }
  }
}

// Creamos una función que devuelve un middleware, permitiéndonos pasar los roles permitidos
export const authMiddleware = (allowedRoles: UserRole[]) => {
  // AÑADIMOS EL TIPO DE RETORNO EXPLÍCITO A LA FUNCIÓN INTERNA
  return (req: Request, res: Response, next: NextFunction): void => {
     // 1. Obtener el token del header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ message: 'Acceso denegado. No se proporcionó un token.' });
      return; // Detenemos la ejecución aquí.
    }

    const token = authHeader.split(' ')[1];

    try {
      // 2. Verificar el token
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        console.error("JWT_SECRET no está configurado");
        res.status(500).json({ message: "Error interno del servidor." });
        return; // Detenemos la ejecución.
      }

      const decoded = jwt.verify(token, jwtSecret) as { id: string; email: string; role: UserRole; iat: number; exp: number };

      // 3. Adjuntar la información del usuario a la petición
      req.user = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
      };

      // 4. Verificar si el rol del usuario está permitido
      if (!allowedRoles.includes(decoded.role)) {
        res.status(403).json({ message: 'Acceso prohibido. No tienes los permisos necesarios.' });
        return; // Detenemos la ejecución.
      }

      // 5. Si todo está bien, continuar.
      next();

    } catch (error) {
      res.status(401).json({ message: 'Token inválido o expirado.' });
      // No es necesario un 'return' aquí porque es la última línea del bloque catch.
    }
  };
};