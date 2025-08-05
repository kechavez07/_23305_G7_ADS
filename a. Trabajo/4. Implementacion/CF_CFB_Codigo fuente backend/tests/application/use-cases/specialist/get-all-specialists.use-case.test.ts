// tests/application/use-cases/specialist/get-all-specialists.use-case.test.ts

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockDeep, DeepMockProxy } from 'vitest-mock-extended';
import { GetAllSpecialistsUseCase } from '@/application/use-cases/specialist/get-all-specialists.use-case';
import { ISpecialistRepository } from '@/domain/repositories/specialist.repository';

// 1. Preparamos los Mocks
const specialistRepositoryMock: DeepMockProxy<ISpecialistRepository> = mockDeep<ISpecialistRepository>();

// 2. Creamos la Instancia del Caso de Uso
const getAllSpecialistsUseCase = new GetAllSpecialistsUseCase(specialistRepositoryMock);

// 3. Escribimos el conjunto de pruebas
describe('GetAllSpecialistsUseCase', () => {

  beforeEach(() => {
    vi.resetAllMocks();
  });

  // --- PRUEBA PARA EL CAMINO POR DEFECTO (SOLO ACTIVOS) ---
  it('should call the repository with "onlyActive = true" when no options are provided', async () => {
    // Arrange (Preparar)
    // Simulamos una lista de especialistas activos que el repositorio devolvería.
    const activeSpecialists = [
      { id: '1', full_name: 'Dr. Activo Uno', is_active: true },
      { id: '2', full_name: 'Dr. Activo Dos', is_active: true },
    ];
    
    // Configuramos el mock para que devuelva esta lista cuando se le llame.
    specialistRepositoryMock.findAll.mockResolvedValue(activeSpecialists as any);

    // Act (Actuar)
    // Ejecutamos el método SIN pasarle ningún argumento.
    const result = await getAllSpecialistsUseCase.execute();

    // Assert (Verificar)
    // a. Verificamos que se llamó al repositorio con el argumento correcto.
    //    !includeInactive -> !false -> true
    expect(specialistRepositoryMock.findAll).toHaveBeenCalledWith(true);
    // b. Verificamos que el resultado es el que devolvió el mock.
    expect(result).toEqual(activeSpecialists);
    expect(result.length).toBe(2);
  });

  // --- PRUEBA PARA EL CAMINO EXPLÍCITO (SOLO ACTIVOS) ---
  it('should call the repository with "onlyActive = true" when "includeInactive" is false', async () => {
    // Arrange
    const activeSpecialists = [{ id: '1', full_name: 'Dr. Activo', is_active: true }];
    specialistRepositoryMock.findAll.mockResolvedValue(activeSpecialists as any);

    // Act
    // Ejecutamos el método pasando explícitamente 'includeInactive: false'.
    const result = await getAllSpecialistsUseCase.execute({ includeInactive: false });

    // Assert
    // El comportamiento esperado es el mismo que en la prueba anterior.
    expect(specialistRepositoryMock.findAll).toHaveBeenCalledWith(true);
    expect(result).toEqual(activeSpecialists);
  });

  // --- PRUEBA PARA OBTENER TODOS (ACTIVOS E INACTIVOS) ---
  it('should call the repository with "onlyActive = false" when "includeInactive" is true', async () => {
    // Arrange
    // Simulamos una lista que contiene tanto especialistas activos como inactivos.
    const allSpecialists = [
      { id: '1', full_name: 'Dr. Activo', is_active: true },
      { id: '2', full_name: 'Dr. Inactivo', is_active: false },
    ];
    specialistRepositoryMock.findAll.mockResolvedValue(allSpecialists as any);

    // Act
    // Ejecutamos el método pasando explícitamente 'includeInactive: true'.
    const result = await getAllSpecialistsUseCase.execute({ includeInactive: true });

    // Assert
    // a. Verificamos que se llamó al repositorio con el argumento correcto.
    //    !includeInactive -> !true -> false
    expect(specialistRepositoryMock.findAll).toHaveBeenCalledWith(false);
    // b. Verificamos que el resultado es la lista completa que devolvió el mock.
    expect(result).toEqual(allSpecialists);
    expect(result.length).toBe(2);
  });
});