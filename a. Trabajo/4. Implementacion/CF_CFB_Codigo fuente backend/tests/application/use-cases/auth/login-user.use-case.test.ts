// tests/application/use-cases/auth/login-user.use-case.test.ts

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockDeep, DeepMockProxy } from 'vitest-mock-extended';
import { LoginUserUseCase } from '@/application/use-cases/auth/login-user.use-case';
import { IUserRepository } from '@/domain/repositories/user.repository';
import { User } from '@prisma/client';
import { LoginUserDto } from '@/application/dtos/auth.dtos';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

// --- 1. MOCKEAMOS LOS MÓDULOS DE TERCEROS ---
// Mockeamos 'bcryptjs' para controlar el resultado de la comparación de contraseñas.
vi.mock('bcryptjs', () => ({
  compare: vi.fn(),
}));

// Mockeamos 'jsonwebtoken' para controlar la generación del token.
vi.mock('jsonwebtoken', () => ({
  sign: vi.fn(),
}));

// --- 2. Mocks de Repositorios ---
const userRepositoryMock: DeepMockProxy<IUserRepository> = mockDeep<IUserRepository>();

// --- 3. Instancia del Caso de Uso ---
const loginUserUseCase = new LoginUserUseCase(userRepositoryMock);

describe('LoginUserUseCase', () => {

  const originalEnv = process.env;

  beforeEach(() => {
    vi.restoreAllMocks(); // Limpia mocks y spies.
    process.env = { ...originalEnv }; // Restaura las variables de entorno.
  });

  // --- PRUEBA PARA EL CAMINO DE ÉXITO ---
  it('should return a token and user data on successful login', async () => {
    // Arrange
    const loginDto: LoginUserDto = {
      email: 'test@example.com',
      password: 'correct_password'
    };
    const mockUser: User = {
      id: 'user-uuid',
      email: loginDto.email,
      full_name: 'Test User',
      password_hash: 'hashed_password_from_db',
      phone_number: '1234567890',
      role: 'CLIENTE',
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    };
    
    process.env.JWT_SECRET = 'my-super-secret-key';
    const expectedToken = 'mock_jwt_token';

    // Configuramos los mocks para el flujo de éxito:
    userRepositoryMock.findByEmail.mockResolvedValue(mockUser);
    (bcrypt.compare as unknown as jest.Mock).mockResolvedValue(true);
    (jwt.sign as unknown as jest.Mock).mockReturnValue(expectedToken);

    // Act
    const result = await loginUserUseCase.execute(loginDto);

    // Assert
    expect(userRepositoryMock.findByEmail).toHaveBeenCalledWith(loginDto.email);
    expect(bcrypt.compare).toHaveBeenCalledWith(loginDto.password, mockUser.password_hash);
    expect(jwt.sign).toHaveBeenCalledWith(
      { id: mockUser.id, email: mockUser.email, role: mockUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    expect(result.token).toBe(expectedToken);
    expect(result.user.full_name).toBe(mockUser.full_name);
  });

  // --- PRUEBA PARA ERROR: USUARIO NO ENCONTRADO ---
  it('should throw "Credenciales inválidas" error if user is not found', async () => {
    // Arrange
    const loginDto: LoginUserDto = { email: 'notfound@example.com', password: 'any_password' };
    userRepositoryMock.findByEmail.mockResolvedValue(null);

    // Act & Assert
    await expect(loginUserUseCase.execute(loginDto)).rejects.toThrow('Credenciales inválidas.');
    expect(bcrypt.compare).not.toHaveBeenCalled();
    expect(jwt.sign).not.toHaveBeenCalled();
  });

  // --- PRUEBA PARA ERROR: CONTRASEÑA INCORRECTA ---
  it('should throw "Credenciales inválidas" error for an invalid password', async () => {
    // Arrange
    const loginDto: LoginUserDto = { email: 'test@example.com', password: 'wrong_password' };
    const mockUser: User = {
      id: 'user-uuid',
      email: loginDto.email,
      full_name: 'Test User',
      password_hash: 'hashed_password_from_db',
      phone_number: '1234567890',
      role: 'CLIENTE',
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    };

    userRepositoryMock.findByEmail.mockResolvedValue(mockUser);
    (bcrypt.compare as unknown as jest.Mock).mockResolvedValue(false); // Simulamos que la contraseña no coincide

    // Act & Assert
    await expect(loginUserUseCase.execute(loginDto)).rejects.toThrow('Credenciales inválidas.');
    expect(jwt.sign).not.toHaveBeenCalled();
  });

  // --- PRUEBA PARA ERROR: FALTA CLAVE SECRETA JWT ---
  it('should throw an error if JWT secret is not configured', async () => {
    // Arrange
    const loginDto: LoginUserDto = { email: 'test@example.com', password: 'correct_password' };
    const mockUser: User = {
      id: 'user-uuid',
      email: loginDto.email,
      full_name: 'Test User',
      password_hash: 'hashed_password_from_db',
      phone_number: '1234567890',
      role: 'CLIENTE',
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    };

    delete process.env.JWT_SECRET; // Simulamos la ausencia de la variable de entorno

    userRepositoryMock.findByEmail.mockResolvedValue(mockUser);
    (bcrypt.compare as unknown as jest.Mock).mockResolvedValue(true);

    // Act & Assert
    await expect(loginUserUseCase.execute(loginDto)).rejects.toThrow('La clave secreta para JWT no está configurada.');
    expect(jwt.sign).not.toHaveBeenCalled();
  });
});