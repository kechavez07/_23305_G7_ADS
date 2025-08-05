import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockDeep, DeepMockProxy } from 'vitest-mock-extended';
import { CreateSpecialtyUseCase } from '@/application/use-cases/specialty/create-specialty.use-case';
import { ISpecialtyRepository } from '@/domain/repositories/specialty.repository';
import { Specialty } from '@prisma/client';

// Mocks
const specialtyRepositoryMock: DeepMockProxy<ISpecialtyRepository> = mockDeep<ISpecialtyRepository>();

// Instancia del Caso de Uso
const createSpecialtyUseCase = new CreateSpecialtyUseCase(specialtyRepositoryMock);

describe('CreateSpecialtyUseCase', () => {
  
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should create a specialty successfully if the name does not exist', async () => {
    // Arrange
    const inputDto = { name: 'Psicología Infantil', description: 'Atención psicológica para niños.' };
    const expectedSpecialty: Specialty = {
      id: 'some-uuid',
      is_active: true,
      created_at: new Date(),
      ...inputDto,
    };

    // Simulamos que no se encuentra ninguna especialidad con ese nombre
    specialtyRepositoryMock.findByName.mockResolvedValue(null);
    // Simulamos que el método create devuelve la nueva especialidad
    specialtyRepositoryMock.create.mockResolvedValue(expectedSpecialty);

    // Act
    const result = await createSpecialtyUseCase.execute(inputDto);

    // Assert
    expect(specialtyRepositoryMock.findByName).toHaveBeenCalledWith(inputDto.name);
    expect(specialtyRepositoryMock.create).toHaveBeenCalledWith(inputDto);
    expect(result).toEqual(expectedSpecialty);
    expect(result.name).toBe('Psicología Infantil');
  });

  it('should throw an error if a specialty with the same name already exists', async () => {
    // Arrange
    const inputDto = { name: 'Fisioterapia', description: 'Ya existe' };
    const existingSpecialty: Specialty = {
      id: 'existing-uuid',
      is_active: true,
      created_at: new Date(),
      ...inputDto,
    };

    // Simulamos que SÍ se encuentra una especialidad con ese nombre
    specialtyRepositoryMock.findByName.mockResolvedValue(existingSpecialty);

    // Act & Assert
    await expect(createSpecialtyUseCase.execute(inputDto)).rejects.toThrow('Ya existe una especialidad con este nombre.');
    
    // Verificamos que el método create NUNCA fue llamado
    expect(specialtyRepositoryMock.create).not.toHaveBeenCalled();
  });
});