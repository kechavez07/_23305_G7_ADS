import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockDeep, DeepMockProxy } from 'vitest-mock-extended';
import { GetAllSpecialtiesUseCase } from '@/application/use-cases/specialty/get-all-specialties.use-case';
import { ISpecialtyRepository } from '@/domain/repositories/specialty.repository';
import { Specialty } from '@prisma/client';

// Mocks
const specialtyRepositoryMock: DeepMockProxy<ISpecialtyRepository> = mockDeep<ISpecialtyRepository>();

// Instancia del Caso de Uso
const getAllSpecialtiesUseCase = new GetAllSpecialtiesUseCase(specialtyRepositoryMock);

describe('GetAllSpecialtiesUseCase', () => {
  
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should return only active specialties by default', async () => {
    // Arrange
    const specialties: Specialty[] = [
      { id: '1', name: 'Activa 1', description: '', is_active: true, created_at: new Date() },
      { id: '2', name: 'Activa 2', description: '', is_active: true, created_at: new Date() },
    ];
    // Simulamos que el repositorio devuelve solo las activas
    specialtyRepositoryMock.findAll.mockResolvedValue(specialties);

    // Act
    const result = await getAllSpecialtiesUseCase.execute(); // Sin opciones

    // Assert
    // Verificamos que se llamó al repositorio con el parámetro correcto (onlyActive = true)
    expect(specialtyRepositoryMock.findAll).toHaveBeenCalledWith(true);
    expect(result).toEqual(specialties);
    expect(result.length).toBe(2);
  });

  it('should return all specialties when includeInactive is true', async () => {
    // Arrange
    const allSpecialties: Specialty[] = [
      { id: '1', name: 'Activa 1', description: '', is_active: true, created_at: new Date() },
      { id: '2', name: 'Inactiva 1', description: '', is_active: false, created_at: new Date() },
    ];
    // Simulamos que el repositorio devuelve todas
    specialtyRepositoryMock.findAll.mockResolvedValue(allSpecialties);

    // Act
    const result = await getAllSpecialtiesUseCase.execute({ includeInactive: true });

    // Assert
    // Verificamos que se llamó al repositorio con el parámetro correcto (onlyActive = false)
    expect(specialtyRepositoryMock.findAll).toHaveBeenCalledWith(false);
    expect(result).toEqual(allSpecialties);
    expect(result.length).toBe(2);
  });
});