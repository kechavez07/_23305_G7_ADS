// tests/application/use-cases/appointment/reserve-appointment.use-case.test.ts

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockDeep, DeepMockProxy } from 'vitest-mock-extended';
import { ReserveAppointmentUseCase } from '@/application/use-cases/appointment/reserve-appointment.use-case';
import { IAvailabilityRepository } from '@/domain/repositories/availability.repository';
import { IAppointmentRepository } from '@/domain/repositories/appointment.repository';
import { Availability, Appointment } from '@prisma/client';

// 1. Preparamos los Mocks
const availabilityRepositoryMock: DeepMockProxy<IAvailabilityRepository> = mockDeep<IAvailabilityRepository>();
const appointmentRepositoryMock: DeepMockProxy<IAppointmentRepository> = mockDeep<IAppointmentRepository>();

// 2. Creamos la Instancia del Caso de Uso
const reserveAppointmentUseCase = new ReserveAppointmentUseCase(
  availabilityRepositoryMock,
  appointmentRepositoryMock
);

// 3. Escribimos el conjunto de pruebas
describe('ReserveAppointmentUseCase', () => {

  beforeEach(() => {
    vi.resetAllMocks();
  });

  // --- PRUEBA PARA EL CAMINO DE ÉXITO ---
  it('should reserve an appointment successfully when availability is found and not booked', async () => {
    // Arrange (Preparar)
    const availabilityId = 'uuid-available';
    const patientId = 'uuid-patient';
    const specialistId = 'uuid-specialist';
    const input = { availabilityId, patientId };

    // Objeto que simula un bloque de horario disponible.
    const availableBlock: Availability = {
      id: availabilityId,
      specialist_id: specialistId,
      start_time: new Date(),
      end_time: new Date(),
      is_booked: false, // <-- Condición clave para el éxito
      created_at: new Date(),
    };

    // Objeto que simula la cita que se creará.
    const expectedAppointment: Appointment = {
      id: 'new-appointment-uuid',
      patient_id: patientId,
      specialist_id: specialistId,
      availability_id: availabilityId,
      status: 'RESERVADA',
      notes: null,
      created_at: new Date(),
      updated_at: new Date(),
    };

    // Configuramos los mocks:
    // - findById debe encontrar el bloque disponible.
    availabilityRepositoryMock.findById.mockResolvedValue(availableBlock);
    // - create debe devolver la nueva cita.
    appointmentRepositoryMock.create.mockResolvedValue(expectedAppointment);

    // Act (Actuar)
    const result = await reserveAppointmentUseCase.execute(input);

    // Assert (Verificar)
    // a. Se buscó la disponibilidad por su ID.
    expect(availabilityRepositoryMock.findById).toHaveBeenCalledWith(availabilityId);
    // b. Se llamó al método de creación de citas con los datos correctos.
    expect(appointmentRepositoryMock.create).toHaveBeenCalledWith(
      {
        patient_id: patientId,
        specialist_id: specialistId,
      },
      availabilityId
    );
    // c. El resultado devuelto es la nueva cita.
    expect(result).toEqual(expectedAppointment);
  });

  // --- PRUEBA PARA EL CAMINO DE ERROR (DISPONIBILIDAD NO ENCONTRADA) ---
  it('should throw an error if the availability block does not exist', async () => {
    // Arrange
    const availabilityId = 'uuid-not-found';
    const patientId = 'uuid-patient';
    const input = { availabilityId, patientId };

    // Configuramos el mock para que devuelva null.
    availabilityRepositoryMock.findById.mockResolvedValue(null);

    // Act & Assert
    // Verificamos que se lanza el error esperado.
    await expect(reserveAppointmentUseCase.execute(input)).rejects.toThrow('El horario seleccionado no existe.');

    // Verificamos que nunca se intentó crear una cita.
    expect(appointmentRepositoryMock.create).not.toHaveBeenCalled();
  });

  // --- PRUEBA PARA EL CAMINO DE ERROR (YA RESERVADO) ---
  it('should throw an error if the availability block is already booked', async () => {
    // Arrange
    const availabilityId = 'uuid-booked';
    const patientId = 'uuid-patient';
    const input = { availabilityId, patientId };

    // Objeto que simula un bloque ya reservado.
    const bookedBlock: Availability = {
      id: availabilityId,
      specialist_id: 'specialist-uuid',
      start_time: new Date(),
      end_time: new Date(),
      is_booked: true, // <-- Condición clave para este error
      created_at: new Date(),
    };

    // Configuramos el mock para que devuelva el bloque reservado.
    availabilityRepositoryMock.findById.mockResolvedValue(bookedBlock);

    // Act & Assert
    // Verificamos que se lanza el error de "doble reserva".
    await expect(reserveAppointmentUseCase.execute(input)).rejects.toThrow('Este horario ya no está disponible. Por favor, seleccione otro.');

    // Verificamos que nunca se intentó crear una cita.
    expect(appointmentRepositoryMock.create).not.toHaveBeenCalled();
  });
});