// tests/application/use-cases/availability/delete-availability.use-case.test.ts

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockDeep, DeepMockProxy } from 'vitest-mock-extended';
import { DeleteAvailabilityUseCase } from '@/application/use-cases/availability/delete-availability.use-case';
import { IAvailabilityRepository } from '@/domain/repositories/availability.repository';
import { Availability } from '@prisma/client';

// 1. Preparamos los Mocks
const availabilityRepositoryMock: DeepMockProxy<IAvailabilityRepository> = mockDeep<IAvailabilityRepository>();

// 2. Creamos la Instancia del Caso de Uso
const deleteAvailabilityUseCase = new DeleteAvailabilityUseCase(availabilityRepositoryMock);

// 3. Escribimos el conjunto de pruebas
describe('DeleteAvailabilityUseCase', () => {

  beforeEach(() => {
    vi.resetAllMocks();
  });

  // --- PRUEBA PARA EL CAMINO DE ÉXITO ---
  it('should delete an availability block successfully if it exists and is not booked', async () => {
    // Arrange (Preparar)
    const availabilityId = 'uuid-available-to-delete';
    
    // Objeto que simula un bloque de horario disponible y no reservado.
    const availableBlock: Availability = {
      id: availabilityId,
      specialist_id: 'specialist-uuid',
      start_time: new Date(),
      end_time: new Date(),
      is_booked: false, // <-- Condición clave para el éxito
      created_at: new Date(),
    };

    // Configuramos los mocks:
    // - findById debe encontrar el bloque.
    availabilityRepositoryMock.findById.mockResolvedValue(availableBlock);
    // - delete debe devolver el bloque eliminado.
    availabilityRepositoryMock.delete.mockResolvedValue(availableBlock);

    // Act (Actuar)
    const result = await deleteAvailabilityUseCase.execute(availabilityId);

    // Assert (Verificar)
    // a. Se buscó el bloque por su ID.
    expect(availabilityRepositoryMock.findById).toHaveBeenCalledWith(availabilityId);
    // b. Se llamó al método de eliminación.
    expect(availabilityRepositoryMock.delete).toHaveBeenCalledWith(availabilityId);
    // c. El resultado devuelto es el esperado.
    expect(result).toEqual(availableBlock);
  });

  // --- PRUEBA PARA EL CAMINO DE ERROR (NO ENCONTRADO) ---
  it('should throw an error if the availability block is not found', async () => {
    // Arrange
    const availabilityId = 'uuid-not-found';
    
    // Configuramos el mock para que devuelva null.
    availabilityRepositoryMock.findById.mockResolvedValue(null);

    // Act & Assert
    // Verificamos que se lanza el error correcto.
    await expect(deleteAvailabilityUseCase.execute(availabilityId)).rejects.toThrow('Bloque de disponibilidad no encontrado.');
    
    // Verificamos que, como no se encontró, nunca se intentó eliminar.
    expect(availabilityRepositoryMock.delete).not.toHaveBeenCalled();
  });

  // --- PRUEBA PARA EL CAMINO DE ERROR (YA RESERVADO) ---
  it('should throw an error if the availability block is already booked', async () => {
    // Arrange
    const availabilityId = 'uuid-already-booked';
    
    // Objeto que simula un bloque de horario que ya tiene una cita.
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
    // Verificamos que se lanza el error de protección de citas.
    await expect(deleteAvailabilityUseCase.execute(availabilityId)).rejects.toThrow('No se puede eliminar un horario que ya tiene una cita agendada.');
    
    // Verificamos que, como estaba reservado, nunca se intentó eliminar.
    expect(availabilityRepositoryMock.delete).not.toHaveBeenCalled();
  });
});