// tests/application/use-cases/specialty/deactivate-specialty.use-case.test.ts

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockDeep, DeepMockProxy } from 'vitest-mock-extended';
//import { DeactivateSpecialtyUseCase } from '@/application/use-cases/specialty/deactivate-specialty.use-case';
import { DeactivateSpecialtyUseCase } from '@/application/use-cases/specialty/deactivate-specialty.use-case';
import { ISpecialtyRepository } from '@/domain/repositories/specialty.repository';
import { Specialty } from '@prisma/client';

// 1. Preparamos los Mocks (Simulaciones)
// Creamos una versión falsa y controlable de la interfaz del repositorio.
const specialtyRepositoryMock: DeepMockProxy<ISpecialtyRepository> = mockDeep<ISpecialtyRepository>();

// 2. Creamos la Instancia del Caso de Uso
// Inyectamos nuestro repositorio falso en el caso de uso que vamos a probar.
const deactivateSpecialtyUseCase = new DeactivateSpecialtyUseCase(specialtyRepositoryMock);

// 3. Escribimos el conjunto de pruebas (Test Suite)
describe('DeactivateSpecialtyUseCase', () => {

  // Antes de cada prueba, reseteamos los mocks para que una prueba no afecte a la otra.
  beforeEach(() => {
    vi.resetAllMocks();
  });

  // --- PRUEBA PARA EL CAMINO DE ÉXITO ---
  it('should deactivate an active specialty successfully', async () => {
    // Arrange (Preparar)
    const specialtyId = 'uuid-valido-activo';
    const activeSpecialty: Specialty = {
      id: specialtyId,
      name: 'Fisioterapia',
      description: 'Test',
      is_active: true,
      created_at: new Date(),
    };
    
    // Configuramos nuestros mocks:
    // - Cuando se llame a findById, debe devolver la especialidad activa.
    specialtyRepositoryMock.findById.mockResolvedValue(activeSpecialty);
    // - Cuando se llame a deactivate, debe devolver la especialidad ya desactivada.
    specialtyRepositoryMock.deactivate.mockResolvedValue({ ...activeSpecialty, is_active: false });

    // Act (Actuar)
    // Ejecutamos el método que queremos probar.
    const result = await deactivateSpecialtyUseCase.execute(specialtyId);

    // Assert (Verificar)
    // Verificamos que los métodos del mock fueron llamados como esperábamos.
    expect(specialtyRepositoryMock.findById).toHaveBeenCalledWith(specialtyId);
    expect(specialtyRepositoryMock.deactivate).toHaveBeenCalledWith(specialtyId);
    // Verificamos que el resultado es el correcto.
    expect(result.is_active).toBe(false);
  });

  // --- PRUEBA PARA EL CAMINO DE ERROR (NO ENCONTRADO) ---
  it('should throw an error if the specialty is not found', async () => {
    // Arrange
    const specialtyId = 'uuid-no-existente';
    // Configuramos el mock para que devuelva null, simulando que no encontró nada.
    specialtyRepositoryMock.findById.mockResolvedValue(null);

    // Act & Assert
    // Verificamos que la ejecución de la función LANCE un error con el mensaje esperado.
    await expect(deactivateSpecialtyUseCase.execute(specialtyId)).rejects.toThrow('Especialidad no encontrada.');
    
    // Verificamos que el método de desactivación NUNCA fue llamado.
    expect(specialtyRepositoryMock.deactivate).not.toHaveBeenCalled();
  });

  // --- PRUEBA PARA EL CAMINO DE ERROR (YA INACTIVA) ---
  it('should throw an error if the specialty is already inactive', async () => {
    // Arrange
    const specialtyId = 'uuid-inactivo';
    const inactiveSpecialty: Specialty = {
      id: specialtyId,
      name: 'Cardiología',
      description: 'Test',
      is_active: false,
      created_at: new Date(),
    };
    specialtyRepositoryMock.findById.mockResolvedValue(inactiveSpecialty);

    // Act & Assert
    await expect(deactivateSpecialtyUseCase.execute(specialtyId)).rejects.toThrow('Esta especialidad ya se encuentra inactiva.');
    expect(specialtyRepositoryMock.deactivate).not.toHaveBeenCalled();
  });
});