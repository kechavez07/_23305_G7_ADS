// tests/application/use-cases/specialist/deactivate-specialist.use-case.test.ts

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockDeep, DeepMockProxy } from 'vitest-mock-extended';
import { DeactivateSpecialistUseCase } from '@/application/use-cases/specialist/deactivate-specialist.use-case';
import { ISpecialistRepository, FullSpecialistProfile } from '@/domain/repositories/specialist.repository';

// 1. Preparamos los Mocks (Simulaciones)
// Creamos una versión falsa y controlable de la interfaz del repositorio.
const specialistRepositoryMock: DeepMockProxy<ISpecialistRepository> = mockDeep<ISpecialistRepository>();

// 2. Creamos la Instancia del Caso de Uso
// Inyectamos nuestro repositorio falso en el caso de uso que vamos a probar.
const deactivateSpecialistUseCase = new DeactivateSpecialistUseCase(specialistRepositoryMock);

// 3. Escribimos el conjunto de pruebas (Test Suite)
describe('DeactivateSpecialistUseCase', () => {

  // Antes de cada prueba, reseteamos los mocks para evitar interferencias.
  beforeEach(() => {
    vi.resetAllMocks();
  });

  // --- PRUEBA PARA EL CAMINO DE ÉXITO ---
  it('should deactivate an active specialist successfully', async () => {
    // Arrange (Preparar)
    const specialistId = 'uuid-valido-activo';
    const input = { id: specialistId };

    // Creamos un objeto que simula el perfil completo de un especialista activo.
    const activeSpecialist: FullSpecialistProfile = {
      id: specialistId,
      full_name: 'Dr. Activo',
      email: 'activo@example.com',
      phone_number: '1234567890',
      password_hash: 'fake-hash', // Added required property
      is_active: true,
      role: 'ESPECIALISTA',
      created_at: new Date(),
      updated_at: new Date(),
      specialist_profile: {
        user_id: specialistId,
        specialty_id: 'some-specialty-id',
        title: 'Fisioterapeuta',
        created_at: new Date(),
      }
    };

    // Creamos el objeto que esperamos como resultado de la desactivación.
    const deactivatedSpecialist = { ...activeSpecialist, is_active: false };
    
    // Configuramos nuestros mocks:
    // - Cuando se llame a findById, debe devolver el especialista activo.
    specialistRepositoryMock.findById.mockResolvedValue(activeSpecialist);
    // - Cuando se llame a deactivate, debe devolver el especialista ya con el estado 'is_active: false'.
    specialistRepositoryMock.deactivate.mockResolvedValue(deactivatedSpecialist);

    // Act (Actuar)
    // Ejecutamos el método que queremos probar.
    const result = await deactivateSpecialistUseCase.execute(input);

    // Assert (Verificar)
    // Verificamos que los métodos del mock fueron llamados como esperábamos.
    expect(specialistRepositoryMock.findById).toHaveBeenCalledWith(specialistId);
    expect(specialistRepositoryMock.deactivate).toHaveBeenCalledWith(specialistId);
    // Verificamos que el resultado es el correcto.
    expect(result).toEqual(deactivatedSpecialist);
    expect(result.is_active).toBe(false);
  });

  // --- PRUEBA PARA EL CAMINO DE ERROR (NO ENCONTRADO) ---
  it('should throw an error if the specialist is not found', async () => {
    // Arrange
    const specialistId = 'uuid-no-existente';
    const input = { id: specialistId };

    // Configuramos el mock para que devuelva null, simulando que no encontró nada.
    specialistRepositoryMock.findById.mockResolvedValue(null);

    // Act & Assert
    // Verificamos que la ejecución de la función LANCE un error con el mensaje esperado.
    await expect(deactivateSpecialistUseCase.execute(input)).rejects.toThrow('Especialista no encontrado.');
    
    // Verificamos que el método de desactivación NUNCA fue llamado, ya que el flujo se detuvo antes.
    expect(specialistRepositoryMock.deactivate).not.toHaveBeenCalled();
  });

  // --- PRUEBA PARA EL CAMINO DE ERROR (YA INACTIVO) ---
  it('should throw an error if the specialist is already inactive', async () => {
    // Arrange
    const specialistId = 'uuid-inactivo';
    const input = { id: specialistId };
    
    // Creamos un objeto que simula el perfil de un especialista que ya está inactivo.
    const inactiveSpecialist: FullSpecialistProfile = {
      id: specialistId,
      full_name: 'Dr. Inactivo',
      email: 'inactivo@example.com',
      phone_number: '0987654321',
      password_hash: 'fake-hash', // Added required property
      is_active: false, // <-- La condición clave de esta prueba
      role: 'ESPECIALISTA',
      created_at: new Date(),
      updated_at: new Date(),
      specialist_profile: null
    };
    specialistRepositoryMock.findById.mockResolvedValue(inactiveSpecialist);

    // Act & Assert
    await expect(deactivateSpecialistUseCase.execute(input)).rejects.toThrow('Este especialista ya se encuentra inactivo.');
    
    // Verificamos que el método de desactivación NUNCA fue llamado.
    expect(specialistRepositoryMock.deactivate).not.toHaveBeenCalled();
  });
});