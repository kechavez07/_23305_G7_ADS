// tests/application/use-cases/availability/create-availability.use-case.test.ts

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockDeep, DeepMockProxy } from 'vitest-mock-extended';
import { CreateAvailabilityUseCase } from '@/application/use-cases/availability/create-availability.use-case';
import { IAvailabilityRepository } from '@/domain/repositories/availability.repository';
import { CreateAvailabilityDto } from '@/application/dtos/availability.dtos';
import { Availability } from '@prisma/client';

// 1. Preparamos los Mocks
const availabilityRepositoryMock: DeepMockProxy<IAvailabilityRepository> = mockDeep<IAvailabilityRepository>();

// 2. Creamos la Instancia del Caso de Uso
const createAvailabilityUseCase = new CreateAvailabilityUseCase(availabilityRepositoryMock);

// 3. Escribimos el conjunto de pruebas
describe('CreateAvailabilityUseCase', () => {

  beforeEach(() => {
    vi.resetAllMocks();
  });

  // --- PRUEBA PARA EL CAMINO DE ÉXITO ---
  it('should create an availability block when there are no overlapping schedules', async () => {
    // Arrange (Preparar)
    const inputDto: CreateAvailabilityDto = {
      specialist_id: 'uuid-specialist-1',
      start_time: '2024-08-01T10:00:00.000Z',
      end_time: '2024-08-01T11:00:00.000Z',
    };

    const expectedAvailability: Availability = {
      id: 'new-availability-uuid',
      specialist_id: inputDto.specialist_id!,
      start_time: new Date(inputDto.start_time),
      end_time: new Date(inputDto.end_time),
      is_booked: false,
      created_at: new Date(),
    };

    // Configuramos los mocks:
    // - findManyBySpecialistId devuelve un array vacío, simulando que no hay horarios conflictivos.
    availabilityRepositoryMock.findManyBySpecialistId.mockResolvedValue([]);
    // - create devuelve el nuevo bloque de disponibilidad.
    availabilityRepositoryMock.create.mockResolvedValue(expectedAvailability);

    // Act (Actuar)
    const result = await createAvailabilityUseCase.execute(inputDto);

    // Assert (Verificar)
    // a. Verificamos que se buscó la disponibilidad existente en el rango correcto.
    expect(availabilityRepositoryMock.findManyBySpecialistId).toHaveBeenCalledWith(
      inputDto.specialist_id,
      new Date(inputDto.start_time),
      new Date(inputDto.end_time)
    );
    // b. Verificamos que se llamó al método de creación con los datos correctos.
    expect(availabilityRepositoryMock.create).toHaveBeenCalledWith(inputDto);
    // c. Verificamos que el resultado es el esperado.
    expect(result).toEqual(expectedAvailability);
  });

  // --- PRUEBA PARA EL CAMINO DE ERROR (HORARIO SE SOLAPA) ---
  it('should throw an error if the new schedule overlaps with an existing one', async () => {
    // Arrange
    const inputDto: CreateAvailabilityDto = {
      specialist_id: 'uuid-specialist-1',
      start_time: '2024-08-01T10:00:00.000Z',
      end_time: '2024-08-01T11:00:00.000Z',
    };

    // Simulamos un bloque existente que se solapa con el nuevo (empieza a las 10:30).
    const existingAvailability: Availability = {
      id: 'existing-uuid',
      specialist_id: inputDto.specialist_id!,
      start_time: new Date('2024-08-01T10:30:00.000Z'),
      end_time: new Date('2024-08-01T11:30:00.000Z'),
      is_booked: false,
      created_at: new Date(),
    };

    // Configuramos el mock para que devuelva el bloque conflictivo.
    availabilityRepositoryMock.findManyBySpecialistId.mockResolvedValue([existingAvailability]);

    // Act & Assert
    // Verificamos que se lanza un error con el mensaje específico.
    await expect(createAvailabilityUseCase.execute(inputDto)).rejects.toThrow('El nuevo horario se solapa con un bloque de disponibilidad existente.');

    // Verificamos que NUNCA se intentó crear el nuevo bloque.
    expect(availabilityRepositoryMock.create).not.toHaveBeenCalled();
  });

  // --- PRUEBA PARA EL CAMINO DE ERROR (FALTA SPECIALIST_ID) ---
  it('should throw an error if specialist_id is not provided', async () => {
    // Arrange
    // Creamos un DTO sin specialist_id, usando 'as any' para evitar un error de TypeScript en la prueba.
    const inputDto: any = {
      start_time: '2024-08-01T10:00:00.000Z',
      end_time: '2024-08-01T11:00:00.000Z',
    };

    // Act & Assert
    // Verificamos que se lanza el error "fail-fast" antes de cualquier llamada al repositorio.
    await expect(createAvailabilityUseCase.execute(inputDto)).rejects.toThrow('El ID del especialista es requerido.');

    // Verificamos que no se realizó ninguna interacción con la base de datos.
    expect(availabilityRepositoryMock.findManyBySpecialistId).not.toHaveBeenCalled();
    expect(availabilityRepositoryMock.create).not.toHaveBeenCalled();
  });
});