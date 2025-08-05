import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockDeep, DeepMockProxy } from 'vitest-mock-extended';
import { GetSpecialtyByIdUseCase } from '@/application/use-cases/specialty/get-specialty-by-id.use-case';
import { ISpecialtyRepository } from '@/domain/repositories/specialty.repository';
import { Specialty } from '@prisma/client';

// 1. Preparamos los Mocks (Simulaciones)
// Creamos una versión falsa y controlable de la interfaz del repositorio.
const specialtyRepositoryMock: DeepMockProxy<ISpecialtyRepository> = mockDeep<ISpecialtyRepository>();

// 2. Creamos la Instancia del Caso de Uso
// Inyectamos nuestro repositorio falso en el caso de uso que vamos a probar.
const getSpecialtyByIdUseCase = new GetSpecialtyByIdUseCase(specialtyRepositoryMock);

// 3. Escribimos el conjunto de pruebas (Test Suite)
describe('GetSpecialtyByIdUseCase', () => {

  // Antes de cada prueba, reseteamos los mocks para que una prueba no afecte a la otra.
  beforeEach(() => {
    vi.resetAllMocks();
  });

  // --- PRUEBA PARA EL CAMINO DE ÉXITO ---
  it('should return a specialty when a valid and existing ID is provided', async () => {
    // Arrange (Preparar)
    const specialtyId = 'uuid-existente';
    const expectedSpecialty: Specialty = {
      id: specialtyId,
      name: 'Terapia de Lenguaje',
      description: 'Ayuda con problemas de habla.',
      is_active: true,
      created_at: new Date(),
    };
    
    // Configuramos nuestro mock:
    // Cuando se llame a findById con el ID correcto, debe devolver el objeto de la especialidad.
    specialtyRepositoryMock.findById.mockResolvedValue(expectedSpecialty);

    // Act (Actuar)
    // Ejecutamos el método que queremos probar.
    const result = await getSpecialtyByIdUseCase.execute(specialtyId);

    // Assert (Verificar)
    // Verificamos que el método del mock fue llamado exactamente con el ID que le pasamos.
    expect(specialtyRepositoryMock.findById).toHaveBeenCalledWith(specialtyId);
    
    // Verificamos que el resultado es el objeto que esperamos.
    expect(result).toEqual(expectedSpecialty);
    expect(result.id).toBe(specialtyId);
  });

  // --- PRUEBA PARA EL CAMINO DE ERROR (NO ENCONTRADO) ---
  it('should throw an error if the specialty ID does not exist', async () => {
    // Arrange
    const specialtyId = 'uuid-no-existente';
    
    // Configuramos el mock para que devuelva null, simulando que no encontró nada.
    specialtyRepositoryMock.findById.mockResolvedValue(null);

    // Act & Assert
    // Verificamos que la ejecución de la función LANCE un error con el mensaje esperado.
    // El uso de 'await' con 'expect().rejects' es crucial para promesas que fallan.
    await expect(getSpecialtyByIdUseCase.execute(specialtyId)).rejects.toThrow('Especialidad no encontrada.');
    
    // Verificamos que el método del mock fue llamado, aunque no encontrara nada.
    expect(specialtyRepositoryMock.findById).toHaveBeenCalledWith(specialtyId);
  });

  // --- PRUEBA OPCIONAL (Basado en el comentario en tu código) ---
  // Esta prueba solo sería relevante si descomentaras la lógica para ocultar especialidades inactivas.
  // La dejo aquí como ejemplo de cómo la probarías.
  it('should return an inactive specialty if the logic allows it', async () => {
    // Arrange
    const specialtyId = 'uuid-inactivo';
    const inactiveSpecialty: Specialty = {
        id: specialtyId,
        name: 'Cardiología Antigua',
        description: 'Ya no se ofrece.',
        is_active: false,
        created_at: new Date(),
    };
    specialtyRepositoryMock.findById.mockResolvedValue(inactiveSpecialty);

    // Act
    const result = await getSpecialtyByIdUseCase.execute(specialtyId);

    // Assert
    // La prueba de éxito actual espera que se devuelva la especialidad sin importar su estado.
    expect(result).toEqual(inactiveSpecialty);
    expect(result.is_active).toBe(false);
  });
});