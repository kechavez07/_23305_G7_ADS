// tests/application/use-cases/specialist/create-specialist.use-case.test.ts

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockDeep, DeepMockProxy } from 'vitest-mock-extended';
import { CreateSpecialistUseCase } from '@/application/use-cases/specialist/create-specialist.use-case';
import { IUserRepository } from '@/domain/repositories/user.repository';
import { ISpecialistRepository } from '@/domain/repositories/specialist.repository';
import { IEmailService } from '@/domain/services/email.service';
import { User } from '@prisma/client';
import { CreateSpecialistDto } from '@/application/dtos/specialist.dtos';
import * as bcrypt from 'bcryptjs';

// --- 1. MOCKEAMOS EL MÓDULO BCRYPTJS ---
// Esta llamada es "elevada" (hoisted) por Vitest y se ejecuta antes de cualquier importación.
vi.mock('bcryptjs', () => ({
  // Mockeamos la función 'hash' específicamente.
  // La hacemos una función mock de Vitest para poder espiarla después.
  hash: vi.fn(),
}));

// --- 2. Mocks de Repositorios y Servicios ---
const userRepositoryMock: DeepMockProxy<IUserRepository> = mockDeep<IUserRepository>();
const specialistRepositoryMock: DeepMockProxy<ISpecialistRepository> = mockDeep<ISpecialistRepository>();
const emailServiceMock: DeepMockProxy<IEmailService> = mockDeep<IEmailService>();

// --- 3. Instancia del Caso de Uso ---
const createSpecialistUseCase = new CreateSpecialistUseCase(
  userRepositoryMock,
  specialistRepositoryMock,
  emailServiceMock
);

describe('CreateSpecialistUseCase', () => {

  beforeEach(() => {
    vi.restoreAllMocks(); // Usamos restoreAllMocks para limpiar todo.
  });

  it('should create a specialist, hash the password, and send a welcome email successfully', async () => {
    // Arrange
    const inputDto: CreateSpecialistDto = {
      email: 'nuevo.especialista@example.com',
      full_name: 'Dr. Juan Pérez',
      phone_number: '0998877665',
      specialty_id: 'uuid-specialty-1',
      title: 'Psicólogo Clínico'
    };
    const createdUser: Omit<User, 'password_hash'> = {
      id: 'uuid-user-1',
      email: inputDto.email,
      full_name: inputDto.full_name,
      phone_number: inputDto.phone_number,
      role: 'ESPECIALISTA',
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    };

    // Configuramos el comportamiento de nuestro mock de bcrypt.hash para esta prueba específica.
    (bcrypt.hash as unknown as jest.Mock).mockResolvedValue('hashed_password_mock');

    userRepositoryMock.findByEmail.mockResolvedValue(null);
    specialistRepositoryMock.create.mockResolvedValue(createdUser);
    emailServiceMock.sendSpecialistWelcomeEmail.mockResolvedValue(undefined);

    // Act
    const result = await createSpecialistUseCase.execute(inputDto);

    // Assert
    expect(userRepositoryMock.findByEmail).toHaveBeenCalledWith(inputDto.email);
    expect(bcrypt.hash).toHaveBeenCalled(); // Verificamos que nuestro mock fue llamado
    expect(specialistRepositoryMock.create).toHaveBeenCalledWith(expect.objectContaining({
      ...inputDto,
      password_hash: 'hashed_password_mock' // Esta aserción ahora pasará
    }));
    expect(emailServiceMock.sendSpecialistWelcomeEmail).toHaveBeenCalledWith(
      createdUser.email,
      createdUser.full_name,
      expect.any(String)
    );
    expect(result).toEqual(createdUser);
  });

  // La prueba de error no necesita cambios.
  it('should throw an error if the email is already in use', async () => {
    // Arrange
    const inputDto: CreateSpecialistDto = {
      email: 'email.existente@example.com',
      full_name: 'Otro Doctor',
      phone_number: '0911223344',
      specialty_id: 'uuid-specialty-2',
    };
    const existingUser = { id: 'existing-uuid' } as User;
    userRepositoryMock.findByEmail.mockResolvedValue(existingUser);

    // Act & Assert
    await expect(createSpecialistUseCase.execute(inputDto)).rejects.toThrow('El correo electrónico ya está en uso.');
    expect(specialistRepositoryMock.create).not.toHaveBeenCalled();
    expect(emailServiceMock.sendSpecialistWelcomeEmail).not.toHaveBeenCalled();
  });
});