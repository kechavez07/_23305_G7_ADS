// tests/application/use-cases/auth/register-user.use-case.test.ts

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockDeep, DeepMockProxy } from 'vitest-mock-extended';
import { RegisterUserUseCase } from '@/application/use-cases/auth/register-user.use-case';
import { IUserRepository } from '@/domain/repositories/user.repository';
import { IEmailService } from '@/domain/services/email.service';
import { User, Patient } from '@prisma/client';
import { RegisterUserDto } from '@/application/dtos/auth.dtos';
import * as bcrypt from 'bcryptjs';

// --- 1. MOCKEAMOS MÓDULOS DE TERCEROS ---
vi.mock('bcryptjs', () => ({
  hash: vi.fn(),
}));

// --- 2. Mocks de Repositorios y Servicios ---
const userRepositoryMock: DeepMockProxy<IUserRepository> = mockDeep<IUserRepository>();
const emailServiceMock: DeepMockProxy<IEmailService> = mockDeep<IEmailService>();

// --- 3. Instancia del Caso de Uso ---
const registerUserUseCase = new RegisterUserUseCase(
  userRepositoryMock,
  emailServiceMock
);

describe('RegisterUserUseCase', () => {

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  // --- PRUEBA PARA EL CAMINO DE ÉXITO ---
  it('should create a user, send a welcome email with an auto-generated password, and return the new user', async () => {
    // Arrange (Preparar)
    const inputDto: RegisterUserDto = {
      email: 'nuevo.cliente@example.com',
      full_name: 'Ana García',
      phone_number: '0987654321',
      patient: {
        full_name: 'Carlos García',
        age: 8,
        gender: 'MASCULINO',
      }
    };

    const createdUser: Omit<User, 'password_hash'> = {
      id: 'new-user-uuid',
      email: inputDto.email,
      full_name: inputDto.full_name,
      phone_number: inputDto.phone_number,
      role: 'CLIENTE',
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    };

    // Configuramos los mocks para el flujo de éxito:
    userRepositoryMock.findByEmail.mockResolvedValue(null);
    (bcrypt.hash as unknown as jest.Mock).mockResolvedValue('hashed_password_mock');
    userRepositoryMock.create.mockResolvedValue(createdUser);
    emailServiceMock.sendWelcomeEmail.mockResolvedValue(undefined);

    // Act (Actuar)
    const result = await registerUserUseCase.execute(inputDto);

    // Assert (Verificar)
    // a. Se verificó que el email no existiera.
    expect(userRepositoryMock.findByEmail).toHaveBeenCalledWith(inputDto.email);
    
    // b. Se llamó a bcrypt.hash con una contraseña autogenerada.
    expect(bcrypt.hash).toHaveBeenCalledWith(expect.any(String), 10);
    
    // c. Se llamó al repositorio para crear el usuario con los datos y el hash.
    expect(userRepositoryMock.create).toHaveBeenCalledWith({
      ...inputDto,
      password_hash: 'hashed_password_mock',
    });
    
    // d. Se llamó al servicio de correo con la contraseña en texto plano.
    expect(emailServiceMock.sendWelcomeEmail).toHaveBeenCalledWith(
      createdUser.email,
      expect.stringMatching(/^an8\d{2}$/) // Verifica el patrón "an8" + 2 dígitos
    );
    
    // e. El resultado devuelto es el esperado.
    expect(result).toEqual(createdUser);
  });

  // --- PRUEBA PARA EL CAMINO DE ERROR (EMAIL DUPLICADO) ---
  it('should throw an error if the email is already in use', async () => {
    // Arrange
    const inputDto: RegisterUserDto = {
      email: 'existente@example.com',
      full_name: 'Usuario Repetido',
      phone_number: '0911112222',
      patient: {
        full_name: 'Paciente Repetido',
        age: 5,
      }
    };
    const existingUser = { id: 'existing-uuid' } as User;

    // Simulamos que el email ya existe.
    userRepositoryMock.findByEmail.mockResolvedValue(existingUser);

    // Act & Assert
    // Verificamos que se lanza el error esperado.
    await expect(registerUserUseCase.execute(inputDto)).rejects.toThrow('El correo electrónico ya está en uso.');
    
    // Verificamos que no se continuó con el flujo de creación.
    expect(bcrypt.hash).not.toHaveBeenCalled();
    expect(userRepositoryMock.create).not.toHaveBeenCalled();
    expect(emailServiceMock.sendWelcomeEmail).not.toHaveBeenCalled();
  });
});