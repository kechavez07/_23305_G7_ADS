// tests/application/use-cases/appointment/get-my-appointments.use-case.test.ts

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockDeep, DeepMockProxy } from 'vitest-mock-extended';
import { GetMyAppointmentsUseCase } from '@/application/use-cases/appointment/get-my-appointments.use-case';
import { IAppointmentRepository } from '@/domain/repositories/appointment.repository';
import { IUserRepository } from '@/domain/repositories/user.repository';
import { User, Patient, Appointment, UserRole } from '@prisma/client';

// Define Role enum for testing purposes
enum Role {
  CLIENT = 'CLIENT',
  // Add other roles if needed
}

// 1. Preparamos los Mocks
const appointmentRepositoryMock: DeepMockProxy<IAppointmentRepository> = mockDeep<IAppointmentRepository>();
const userRepositoryMock: DeepMockProxy<IUserRepository> = mockDeep<IUserRepository>();

// 2. Creamos la Instancia del Caso de Uso
const getMyAppointmentsUseCase = new GetMyAppointmentsUseCase(
  appointmentRepositoryMock,
  userRepositoryMock
);

// 3. Escribimos el conjunto de pruebas
describe('GetMyAppointmentsUseCase', () => {

  beforeEach(() => {
    vi.resetAllMocks();
  });

  // --- PRUEBA PARA EL CAMINO DE ÉXITO ---
  it('should return a list of appointments for the client\'s patient', async () => {
    // Arrange (Preparar)
    const clientId = 'client-uuid-1';
    const patientId = 'patient-uuid-1';

    // Objeto que simula al cliente con su paciente asociado.
    const mockClientUser = {
      id: clientId,
      // ... otros campos de User
      representative_for: [{ id: patientId /* ...otros campos de Patient */ }] as Patient[],
    } as User & { representative_for: Patient[] };

    // Lista de citas que esperamos recibir.
    const mockAppointments: Appointment[] = [
      { id: 'appointment-uuid-1', patient_id: patientId, /* ... */ } as Appointment,
      { id: 'appointment-uuid-2', patient_id: patientId, /* ... */ } as Appointment,
    ];

    // Configuramos los mocks:
    // - findById debe encontrar al cliente y su paciente.
    userRepositoryMock.findById.mockResolvedValue(mockClientUser);
    // - findManyByPatientId debe devolver la lista de citas del paciente.
    appointmentRepositoryMock.findManyByPatientId.mockResolvedValue(mockAppointments);

    // Act (Actuar)
    const result = await getMyAppointmentsUseCase.execute(clientId);

    // Assert (Verificar)
    // a. Verificamos que se buscó al usuario cliente por su ID.
    expect(userRepositoryMock.findById).toHaveBeenCalledWith(clientId);
    // b. Verificamos que se buscaron las citas usando el ID del PACIENTE.
    expect(appointmentRepositoryMock.findManyByPatientId).toHaveBeenCalledWith(patientId);
    // c. Verificamos que el resultado es la lista de citas esperada.
    expect(result).toEqual(mockAppointments);
    expect(result).toHaveLength(2);
  });

  // --- PRUEBA PARA EL CAMINO DE ÉXITO (SIN CITAS) ---
  it('should return an empty array if the client\'s patient has no appointments', async () => {
    // Arrange
    const clientId = 'client-uuid-2';
    const patientId = 'patient-uuid-2';
    const mockClientUser = {
      id: clientId,
      representative_for: [{ id: patientId }] as Patient[],
    } as User & { representative_for: Patient[] };

    userRepositoryMock.findById.mockResolvedValue(mockClientUser);
    // Simulamos que el paciente no tiene citas.
    appointmentRepositoryMock.findManyByPatientId.mockResolvedValue([]);

    // Act
    const result = await getMyAppointmentsUseCase.execute(clientId);

    // Assert
    expect(userRepositoryMock.findById).toHaveBeenCalledWith(clientId);
    expect(appointmentRepositoryMock.findManyByPatientId).toHaveBeenCalledWith(patientId);
    expect(result).toEqual([]);
    expect(result).toHaveLength(0);
  });

  // --- PRUEBA PARA EL CAMINO DE ERROR (CLIENTE NO ENCONTRADO) ---
  it('should throw an error if the client user is not found', async () => {
    // Arrange
    const clientId = 'client-uuid-not-found';
    
    // Simulamos que el cliente no existe.
    userRepositoryMock.findById.mockResolvedValue(null);

    // Act & Assert
    await expect(getMyAppointmentsUseCase.execute(clientId)).rejects.toThrow('No se encontró un paciente asociado a este cliente.');
    
    // Verificamos que, al no encontrar al cliente, nunca se intentó buscar citas.
    expect(appointmentRepositoryMock.findManyByPatientId).not.toHaveBeenCalled();
  });

  // --- PRUEBA PARA EL CAMINO DE ERROR (CLIENTE SIN PACIENTE) ---
  it('should throw an error if the client user has no associated patient', async () => {
    // Arrange
    const clientId = 'client-uuid-no-patient';
    const mockClientUser = {
      id: clientId,
      created_at: new Date(),
      updated_at: new Date(),
      email: 'test@example.com',
      full_name: 'Test User',
      phone_number: '1234567890',
      password_hash: 'hashedpassword',
      role: UserRole.CLIENTE, // Use the UserRole enum value from Prisma
      is_active: true,
      representative_for: [], // <-- La condición clave de esta prueba
    } as User & { representative_for: Patient[] };

    userRepositoryMock.findById.mockResolvedValue(mockClientUser);

    // Act & Assert
    await expect(getMyAppointmentsUseCase.execute(clientId)).rejects.toThrow('No se encontró un paciente asociado a este cliente.');
    
    // Verificamos que nunca se intentó buscar citas.
    expect(appointmentRepositoryMock.findManyByPatientId).not.toHaveBeenCalled();
  });
});