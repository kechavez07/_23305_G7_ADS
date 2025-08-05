// tests/application/use-cases/specialist/update-specialist.use-case.test.ts

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockDeep, DeepMockProxy } from 'vitest-mock-extended';
import { UpdateSpecialistUseCase } from '@/application/use-cases/specialist/update-specialist.use-case';
import { ISpecialistRepository } from '@/domain/repositories/specialist.repository';
import { UpdateSpecialistDto } from '@/application/dtos/specialist.dtos';

// 1. Preparamos los Mocks
const specialistRepositoryMock: DeepMockProxy<ISpecialistRepository> = mockDeep<ISpecialistRepository>();

// 2. Creamos la Instancia del Caso de Uso
const updateSpecialistUseCase = new UpdateSpecialistUseCase(specialistRepositoryMock);

// 3. Escribimos el conjunto de pruebas
describe('UpdateSpecialistUseCase', () => {

  beforeEach(() => {
    vi.resetAllMocks();
  });

  // --- PRUEBA PARA EL CAMINO DE ÉXITO ---
  it('should update a specialist successfully when the specialist exists', async () => {
    // Arrange (Preparar)
    const specialistId = 'uuid-existente';
    const updateData: UpdateSpecialistDto = {
      full_name: 'Dr. Juan Pérez Actualizado',
      title: 'Psicólogo Senior',
      is_active: true,
    };
    const input = { id: specialistId, data: updateData };

    // Objeto que simula el estado del especialista ANTES de la actualización.
    const existingSpecialist = {
      id: specialistId,
      full_name: 'Dr. Juan Pérez',
      email: 'juan.perez@example.com',
      phone_number: '1234567890',
      is_active: true,
      role: 'ESPECIALISTA' as const,
      created_at: new Date(),
      updated_at: new Date(),
      specialist_profile: {
        user_id: specialistId,
        specialty_id: 'specialty-1',
        title: 'Psicólogo Clínico',
        created_at: new Date(),
      }
    };

    // Objeto que esperamos que devuelva el método 'update' del repositorio.
    const updatedSpecialist = {
      ...existingSpecialist,
      ...updateData,
      specialist_profile: {
        ...existingSpecialist.specialist_profile,
        title: updateData.title
      }
    };
    
    // Configuramos los mocks:
    // - findById debe encontrar al especialista.
    specialistRepositoryMock.findById.mockResolvedValue(existingSpecialist);
    // - update debe devolver el objeto del especialista actualizado.
    specialistRepositoryMock.update.mockResolvedValue(updatedSpecialist as any);

    // Act (Actuar)
    const result = await updateSpecialistUseCase.execute(input);

    // Assert (Verificar)
    // a. Verificamos que se buscó al especialista por su ID.
    expect(specialistRepositoryMock.findById).toHaveBeenCalledWith(specialistId);
    // b. Verificamos que se llamó al método de actualización con los datos correctos.
    expect(specialistRepositoryMock.update).toHaveBeenCalledWith(specialistId, updateData);
    // c. Verificamos que el resultado es el esperado.
    expect(result).toEqual(updatedSpecialist);
    expect(result.full_name).toBe('Dr. Juan Pérez Actualizado');
  });

  // --- PRUEBA PARA EL CAMINO DE ERROR (NO ENCONTRADO) ---
  it('should throw an error if the specialist to update is not found', async () => {
    // Arrange
    const specialistId = 'uuid-no-existente';
    const updateData: UpdateSpecialistDto = {
      full_name: 'No importa',
    };
    const input = { id: specialistId, data: updateData };

    // Configuramos el mock para que devuelva null, simulando que el especialista no existe.
    specialistRepositoryMock.findById.mockResolvedValue(null);

    // Act & Assert
    // Verificamos que la ejecución lance un error con el mensaje específico.
    await expect(updateSpecialistUseCase.execute(input)).rejects.toThrow('Especialista no encontrado.');
    
    // Verificamos que, como el especialista no fue encontrado, NUNCA se intentó actualizar.
    expect(specialistRepositoryMock.update).not.toHaveBeenCalled();
  });
});