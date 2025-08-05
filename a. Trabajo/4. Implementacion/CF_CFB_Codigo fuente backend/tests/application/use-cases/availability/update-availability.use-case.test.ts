// tests/application/use-cases/availability/update-availability.use-case.test.ts

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockDeep, DeepMockProxy } from 'vitest-mock-extended';
import { UpdateAvailabilityUseCase } from '@/application/use-cases/availability/update-availability.use-case';
import { IAvailabilityRepository } from '@/domain/repositories/availability.repository';
import { UpdateAvailabilityDto } from '@/application/dtos/availability.dtos';
import { Availability } from '@prisma/client';

// 1. Preparamos los Mocks
const availabilityRepositoryMock: DeepMockProxy<IAvailabilityRepository> = mockDeep<IAvailabilityRepository>();

// 2. Creamos la Instancia del Caso de Uso
const updateAvailabilityUseCase = new UpdateAvailabilityUseCase(availabilityRepositoryMock);

describe('UpdateAvailabilityUseCase', () => {

  beforeEach(() => {
    vi.resetAllMocks();
  });

  // --- PRUEBA PARA EL CAMINO DE ÉXITO ---
  it('should update an availability block successfully', async () => {
    // Arrange
    const blockId = 'uuid-to-update';
    const updateDto: UpdateAvailabilityDto = {
      start_time: '2024-08-01T15:00:00.000Z',
      end_time: '2024-08-01T16:00:00.000Z',
    };
    const existingBlock: Availability = {
      id: blockId,
      specialist_id: 'specialist-1',
      start_time: new Date('2024-08-01T10:00:00.000Z'),
      end_time: new Date('2024-08-01T11:00:00.000Z'),
      is_booked: false,
      created_at: new Date(),
    };
    const updatedBlock = { ...existingBlock, ...updateDto, start_time: new Date(updateDto.start_time!), end_time: new Date(updateDto.end_time!) };

    // Configuramos mocks para el éxito:
    availabilityRepositoryMock.findById.mockResolvedValue(existingBlock);
    // No hay otros bloques que se solapen (array vacío)
    availabilityRepositoryMock.findManyBySpecialistId.mockResolvedValue([]);
    availabilityRepositoryMock.update.mockResolvedValue(updatedBlock);

    // Act
    const result = await updateAvailabilityUseCase.execute(blockId, updateDto);

    // Assert
    expect(availabilityRepositoryMock.findById).toHaveBeenCalledWith(blockId);
    expect(availabilityRepositoryMock.findManyBySpecialistId).toHaveBeenCalled();
    expect(availabilityRepositoryMock.update).toHaveBeenCalledWith(blockId, updateDto);
    expect(result).toEqual(updatedBlock);
  });

  // --- PRUEBA PARA EL CAMINO DE ERROR (NO ENCONTRADO) ---
  it('should throw an error if the availability block to update is not found', async () => {
    // Arrange
    const blockId = 'uuid-not-found';
    const updateDto: UpdateAvailabilityDto = { start_time: '2024-08-01T15:00:00.000Z' };
    availabilityRepositoryMock.findById.mockResolvedValue(null);

    // Act & Assert
    await expect(updateAvailabilityUseCase.execute(blockId, updateDto)).rejects.toThrow('Bloque de disponibilidad no encontrado.');
    expect(availabilityRepositoryMock.update).not.toHaveBeenCalled();
  });

  // --- PRUEBA PARA EL CAMINO DE ERROR (YA RESERVADO) ---
  it('should throw an error if the availability block is already booked', async () => {
    // Arrange
    const blockId = 'uuid-booked';
    const updateDto: UpdateAvailabilityDto = { start_time: '2024-08-01T15:00:00.000Z' };
    const bookedBlock: Availability = {
      id: blockId,
      specialist_id: 'specialist-1',
      start_time: new Date(),
      end_time: new Date(),
      is_booked: true, // <-- Condición clave
      created_at: new Date(),
    };
    availabilityRepositoryMock.findById.mockResolvedValue(bookedBlock);

    // Act & Assert
    await expect(updateAvailabilityUseCase.execute(blockId, updateDto)).rejects.toThrow('No se puede modificar un horario que ya tiene una cita agendada.');
    expect(availabilityRepositoryMock.update).not.toHaveBeenCalled();
  });

  // --- PRUEBA PARA EL CAMINO DE ERROR (SE SOLAPA CON OTRO BLOQUE) ---
  it('should throw an error if the updated schedule overlaps with another existing block', async () => {
    // Arrange
    const blockIdToUpdate = 'uuid-to-update';
    const updateDto: UpdateAvailabilityDto = {
      start_time: '2024-08-01T12:00:00.000Z',
      end_time: '2024-08-01T13:00:00.000Z',
    };
    const existingBlockToUpdate: Availability = {
      id: blockIdToUpdate,
      specialist_id: 'specialist-1',
      start_time: new Date('2024-08-01T10:00:00.000Z'),
      end_time: new Date('2024-08-01T11:00:00.000Z'),
      is_booked: false,
      created_at: new Date(),
    };
    const conflictingBlock: Availability = {
      id: 'uuid-conflicting', // <-- ID diferente
      specialist_id: 'specialist-1',
      start_time: new Date('2024-08-01T12:30:00.000Z'),
      end_time: new Date('2024-08-01T13:30:00.000Z'),
      is_booked: false,
      created_at: new Date(),
    };

    // Configuramos mocks:
    availabilityRepositoryMock.findById.mockResolvedValue(existingBlockToUpdate);
    // findManyBySpecialistId devuelve el bloque conflictivo
    availabilityRepositoryMock.findManyBySpecialistId.mockResolvedValue([conflictingBlock]);

    // Act & Assert
    await expect(updateAvailabilityUseCase.execute(blockIdToUpdate, updateDto)).rejects.toThrow('El horario actualizado se solapa con otro bloque de disponibilidad.');
    expect(availabilityRepositoryMock.update).not.toHaveBeenCalled();
  });
});