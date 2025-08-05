import { IUserRepository } from "../../../domain/repositories/user.repository";
import { LoginUserDto } from "../../dtos/auth.dtos";
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

export class LoginUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(dto: LoginUserDto): Promise<{ token: string; user: { id: string, email: string, full_name: string, role: string } }> {
    // 1. Buscar al usuario por su email
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      throw new Error("Credenciales inválidas."); // Mensaje genérico por seguridad
    }

    // 2. Comparar la contraseña enviada con el hash guardado en la BD
    const isPasswordValid = await bcrypt.compare(dto.password, user.password_hash);
    if (!isPasswordValid) {
      throw new Error("Credenciales inválidas."); // Mismo mensaje genérico
    }

    // 3. Generar el JSON Web Token (JWT)
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error("La clave secreta para JWT no está configurada.");
    }

    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(payload, jwtSecret, {
      expiresIn: '7d', // El token expirará en 7 días
    });

    // 4. Devolver el token y la información básica del usuario
    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
      }
    };
  }
}