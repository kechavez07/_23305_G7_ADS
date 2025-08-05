// tests/application/use-cases/specialist/get-specialist-by-id.use-case.test.ts

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockDeep, DeepMockProxy } from 'vitest-mock-extended';
import { GetSpecialistByIdUseCase } from '@/application/use-cases/specialist/get-specialist-by-id.use-case';
import { ISpecialistRepository } from '@/domain/repositories/specialist.repository';

// 1. Preparamos los Mocks
const specialistRepositoryMock: DeepMockProxy<ISpecialistRepository> = mockDeep<ISpecialistRepository>();

// 2. Creamos la Instancia del Caso de Uso
const getSpecialistByIdUseCase = new GetSpecialistByIdUseCase(specialistRepositoryMock);

// 3. Escribimos el conjunto de pruebas
describe('GetSpecialistByIdUseCase', () => {

  beforeEach(() => {
    vi.resetAllMocks();
  });

  // --- PRUEBA PARA EL CAMINO DE ÉXITO ---
  it('should return the full specialist profile when a valid ID is provided', async () => {
    // Arrange (Preparar)
    const specialistId = 'uuid-existente';
    const input = { id: specialistId };
    
    // Creamos un objeto mock completo para el especialista.
    const expectedSpecialist = {
      id: specialistId,
      full_name: 'Dr. Encontrado',
      email: 'encontrado@example.com',
      phone_number: '111222333',
      is_active: true,
      role: 'ESPECIALISTA' as const,
      created_at: new Date(),
      updated_at: new Date(),
      specialist_profile: {
        user_id: specialistId,
        specialty_id: 'specialty-123',
        title: 'Cardiólogo',
        created_at: new Date(),
      }
    };

    // Configuramos el mock para que devuelva el especialista cuando se llame a findById.
    specialistRepositoryMock.findById.mockResolvedValue(expectedSpecialist);

    // Act (Actuar)
    // Ejecutamos el método con el objeto input.
    const result = await getSpecialistByIdUseCase.execute(input);

    // Assert (Verificar)
    // a. Verificamos que se llamó al repositorio con el ID correcto.
    expect(specialistRepositoryMock.findById).toHaveBeenCalledWith(specialistId);
    // b. Verificamos que el resultado devuelto es el objeto que esperamos.
    expect(result).toEqual(expectedSpecialist);
    expect(result.id).toBe(specialistId);
  });

  // --- PRUEBA PARA EL CAMINO DE ERROR (NO ENCONTRADO) ---
  it('should throw an error if the specialist ID does not exist', async () => {
    // Arrange
    const specialistId = 'uuid-no-existente';
    const input = { id: specialistId };

    // Configuramos el mock para que devuelva null, simulando que no se encontró el especialista.
    specialistRepositoryMock.findById.mockResolvedValue(null);

    // Act & Assert
    // Verificamos que al ejecutar el caso de uso, se lance un error con el mensaje correcto.
    await expect(getSpecialistByIdUseCase.execute(input)).rejects.toThrow('Especialista no encontrado.');
    
    // Verificamos que se intentó buscar al especialista, aunque no se encontrara.
    expect(specialistRepositoryMock.findById).toHaveBeenCalledWith(specialistId);
  });
});