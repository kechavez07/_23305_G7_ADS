import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockDeep, DeepMockProxy } from 'vitest-mock-extended';
import { UpdateSpecialtyUseCase } from '@/application/use-cases/specialty/update-specialty.use-case';
import { ISpecialtyRepository } from '@/domain/repositories/specialty.repository';
import { Specialty } from '@prisma/client';

// Mocks
const specialtyRepositoryMock: DeepMockProxy<ISpecialtyRepository> = mockDeep<ISpecialtyRepository>();

// Instancia del Caso de Uso
const updateSpecialtyUseCase = new UpdateSpecialtyUseCase(specialtyRepositoryMock);

describe('UpdateSpecialtyUseCase', () => {
  
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should update a specialty successfully', async () => {
    // Arrange
    const specialtyId = 'uuid-to-update';
    const updateDto = { name: 'Fisioterapia Pediátrica', description: 'Especializada en niños.' };
    const existingSpecialty: Specialty = {
      id: specialtyId,
      name: 'Fisioterapia',
      description: 'General',
      is_active: true,
      created_at: new Date(),
    };
    const updatedSpecialty: Specialty = { ...existingSpecialty, ...updateDto };

    // Simulamos que la especialidad a actualizar existe
    specialtyRepositoryMock.findById.mockResolvedValue(existingSpecialty);
    // Simulamos que no hay otra especialidad con el nuevo nombre
    specialtyRepositoryMock.findByName.mockResolvedValue(null);
    // Simulamos que el método update devuelve la especialidad actualizada
    specialtyRepositoryMock.update.mockResolvedValue(updatedSpecialty);

    // Act
    const result = await updateSpecialtyUseCase.execute(specialtyId, updateDto);

    // Assert
    expect(specialtyRepositoryMock.findById).toHaveBeenCalledWith(specialtyId);
    expect(specialtyRepositoryMock.findByName).toHaveBeenCalledWith(updateDto.name);
    expect(specialtyRepositoryMock.update).toHaveBeenCalledWith(specialtyId, updateDto);
    expect(result).toEqual(updatedSpecialty);
  });

  it('should throw an error if the specialty to update is not found', async () => {
    // Arrange
    const specialtyId = 'uuid-not-found';
    const updateDto = { name: 'Nuevo Nombre' };

    // Simulamos que no se encuentra la especialidad por ID
    specialtyRepositoryMock.findById.mockResolvedValue(null);

    // Act & Assert
    await expect(updateSpecialtyUseCase.execute(specialtyId, updateDto)).rejects.toThrow('Especialidad no encontrada.');
    
    // Verificamos que nunca se intentó actualizar
    expect(specialtyRepositoryMock.update).not.toHaveBeenCalled();
  });

  it('should throw an error if the new name is already in use by another specialty', async () => {
    // Arrange
    const specialtyIdToUpdate = 'uuid-to-update';
    const updateDto = { name: 'Nombre Ocupado' };
    const existingSpecialtyToUpdate: Specialty = {
      id: specialtyIdToUpdate,
      name: 'Nombre Original',
      description: 'Test',
      is_active: true,
      created_at: new Date(),
    };
    const otherSpecialtyWithSameName: Specialty = {
      id: 'other-uuid',
      name: 'Nombre Ocupado',
      description: 'Otra desc',
      is_active: true,
      created_at: new Date(),
    };

    // Simulamos que la especialidad a actualizar existe
    specialtyRepositoryMock.findById.mockResolvedValue(existingSpecialtyToUpdate);
    // Simulamos que SÍ se encuentra otra especialidad con el nuevo nombre
    specialtyRepositoryMock.findByName.mockResolvedValue(otherSpecialtyWithSameName);

    // Act & Assert
    await expect(updateSpecialtyUseCase.execute(specialtyIdToUpdate, updateDto)).rejects.toThrow('Ya existe otra especialidad con ese nombre.');
    
    // Verificamos que nunca se intentó actualizar
    expect(specialtyRepositoryMock.update).not.toHaveBeenCalled();
  });
});