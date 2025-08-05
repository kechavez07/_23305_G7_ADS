// tests/application/use-cases/availability/get-availabilities-by-specialist.use-case.test.ts

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockDeep, DeepMockProxy } from 'vitest-mock-extended';
import { GetAvailabilitiesBySpecialistUseCase } from '@/application/use-cases/availability/get-availabilities-by-specialist.use-case';
import { IAvailabilityRepository } from '@/domain/repositories/availability.repository';
import { Availability } from '@prisma/client';

// 1. Preparamos los Mocks
const availabilityRepositoryMock: DeepMockProxy<IAvailabilityRepository> = mockDeep<IAvailabilityRepository>();

// 2. Creamos la Instancia del Caso de Uso
const getAvailabilitiesBySpecialistUseCase = new GetAvailabilitiesBySpecialistUseCase(availabilityRepositoryMock);

// 3. Escribimos el conjunto de pruebas
describe('GetAvailabilitiesBySpecialistUseCase', () => {

  beforeEach(() => {
    vi.resetAllMocks();
  });

  // --- PRUEBA PARA EL CAMINO DE ÉXITO (CON RESULTADOS) ---
  it('should return a list of availability blocks for a given specialist and date range', async () => {
    // Arrange (Preparar)
    const specialistId = 'uuid-specialist-1';
    const startDate = new Date('2024-08-01T00:00:00.000Z');
    const endDate = new Date('2024-08-07T23:59:59.999Z');

    // Creamos una lista simulada de bloques de disponibilidad que el repositorio debería devolver.
    const expectedAvailabilities: Availability[] = [
      {
        id: 'uuid-block-1',
        specialist_id: specialistId,
        start_time: new Date('2024-08-05T10:00:00.000Z'),
        end_time: new Date('2024-08-05T11:00:00.000Z'),
        is_booked: false,
        created_at: new Date(),
      },
      {
        id: 'uuid-block-2',
        specialist_id: specialistId,
        start_time: new Date('2024-08-06T14:00:00.000Z'),
        end_time: new Date('2024-08-06T15:00:00.000Z'),
        is_booked: true,
        created_at: new Date(),
      }
    ];

    // Configuramos el mock para que devuelva la lista de bloques.
    availabilityRepositoryMock.findManyBySpecialistId.mockResolvedValue(expectedAvailabilities);

    // Act (Actuar)
    // Ejecutamos el método con los parámetros de prueba.
    const result = await getAvailabilitiesBySpecialistUseCase.execute(specialistId, startDate, endDate);

    // Assert (Verificar)
    // a. Verificamos que se llamó al repositorio con los parámetros exactos.
    expect(availabilityRepositoryMock.findManyBySpecialistId).toHaveBeenCalledWith(specialistId, startDate, endDate);
    // b. Verificamos que el resultado es la lista que devolvió el mock.
    expect(result).toEqual(expectedAvailabilities);
    expect(result).toHaveLength(2);
  });

  // --- PRUEBA PARA EL CAMINO DE ÉXITO (SIN RESULTADOS) ---
  it('should return an empty array if no availability blocks are found in the date range', async () => {
    // Arrange
    const specialistId = 'uuid-specialist-2';
    const startDate = new Date('2024-09-01T00:00:00.000Z');
    const endDate = new Date('2024-09-07T23:59:59.999Z');

    // Configuramos el mock para que devuelva un array vacío.
    availabilityRepositoryMock.findManyBySpecialistId.mockResolvedValue([]);

    // Act
    const result = await getAvailabilitiesBySpecialistUseCase.execute(specialistId, startDate, endDate);

    // Assert
    // Verificamos que se llamó al repositorio correctamente.
    expect(availabilityRepositoryMock.findManyBySpecialistId).toHaveBeenCalledWith(specialistId, startDate, endDate);
    // Verificamos que el resultado es un array vacío.
    expect(result).toEqual([]);
    expect(result).toHaveLength(0);
  });
});