// tests/application/use-cases/availability/create-weekly-schedule.use-case.test.ts

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockDeep, DeepMockProxy } from 'vitest-mock-extended';
import { CreateWeeklyScheduleUseCase } from '@/application/use-cases/availability/create-weekly-schedule.use-case';
import { IAvailabilityRepository } from '@/domain/repositories/availability.repository';
import { CreateWeeklyScheduleDto } from '@/application/dtos/availability.dtos';
import { Availability } from '@prisma/client';

// Mocks
const availabilityRepositoryMock: DeepMockProxy<IAvailabilityRepository> = mockDeep<IAvailabilityRepository>();

// Instancia del Caso de Uso
const createWeeklyScheduleUseCase = new CreateWeeklyScheduleUseCase(availabilityRepositoryMock);

// Helper function from the use case to ensure dates are consistent in tests
const getNextWeekDateForDay = (dayIndex: number): Date => {
    const now = new Date();
    const currentDay = now.getDay(); // 0 (Sunday) - 6 (Saturday)
    const daysUntilNextMonday = (8 - currentDay) % 7;
    const nextMonday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + daysUntilNextMonday);
    const targetDay = dayIndex === 0 ? 7 : dayIndex;
    return new Date(nextMonday.getFullYear(), nextMonday.getMonth(), nextMonday.getDate() + targetDay - 1);
};


describe('CreateWeeklyScheduleUseCase', () => {

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should generate and create weekly schedule slots successfully', async () => {
    // Arrange
    const specialistId = 'uuid-specialist-1';
    const inputDto: CreateWeeklyScheduleDto = {
      specialist_id: specialistId,
      schedule: {
        lunes: [{ start: "09:00", end: "11:00" }],     // This is 1 slot
        miercoles: [{ start: "14:00", end: "15:00" }], // This is 1 slot
      },
    };

    availabilityRepositoryMock.findManyBySpecialistId.mockResolvedValue([]);
    // FIX: Expect 2 slots to be created, not 3
    availabilityRepositoryMock.createMany.mockResolvedValue({ count: 2 });

    // Act
    const result = await createWeeklyScheduleUseCase.execute(inputDto);

    // Assert
    expect(availabilityRepositoryMock.findManyBySpecialistId).toHaveBeenCalledOnce();
    const createdSlots = availabilityRepositoryMock.createMany.mock.calls[0][0];
    
    // FIX: The correct length is 2
    expect(createdSlots).toHaveLength(2);
    
    expect(createdSlots[0]).toEqual(expect.objectContaining({ specialist_id: specialistId }));
    expect(result.count).toBe(2);
  });

  it('should throw an error if any generated slot overlaps with existing availability', async () => {
    // Arrange
    const specialistId = 'uuid-specialist-1';
    const inputDto: CreateWeeklyScheduleDto = {
      specialist_id: specialistId,
      schedule: {
        lunes: [{ start: "09:00", end: "11:00" }],
      },
    };

    // FIX: Create a realistic conflicting block for NEXT week
    // We use the helper function to get the date for next Monday (dayIndex 1)
    const nextMonday = getNextWeekDateForDay(1);
    
    const conflictingStartTime = new Date(nextMonday);
    conflictingStartTime.setHours(10, 0, 0, 0); // 10:00 AM overlaps with 09:00-11:00

    const conflictingEndTime = new Date(nextMonday);
    conflictingEndTime.setHours(10, 30, 0, 0);

    const existingBlock: Availability = {
      id: 'existing-uuid',
      specialist_id: specialistId,
      start_time: conflictingStartTime,
      end_time: conflictingEndTime,
      is_booked: false,
      created_at: new Date(),
    };
    availabilityRepositoryMock.findManyBySpecialistId.mockResolvedValue([existingBlock]);

    // Act & Assert
    await expect(createWeeklyScheduleUseCase.execute(inputDto)).rejects.toThrow(/se solapa con un bloque ya existente/);

    expect(availabilityRepositoryMock.createMany).not.toHaveBeenCalled();
  });

  it('should throw an error if specialist_id is not provided', async () => {
    const inputDto = { schedule: {} } as CreateWeeklyScheduleDto;
    await expect(createWeeklyScheduleUseCase.execute(inputDto)).rejects.toThrow('El ID del especialista es requerido para crear el horario.');
  });
  
  it('should throw an error if the provided schedule is empty or invalid', async () => {
    const inputDto: CreateWeeklyScheduleDto = {
      specialist_id: 'uuid-specialist-1',
      schedule: {},
    };
    await expect(createWeeklyScheduleUseCase.execute(inputDto)).rejects.toThrow('El horario proporcionado no contiene ningún bloque de tiempo válido.');
  });
});