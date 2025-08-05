// src/application/use-cases/availability/create-weekly-schedule.use-case.ts

import { IAvailabilityRepository } from "../../../domain/repositories/availability.repository";
import { CreateWeeklyScheduleDto } from "../../dtos/availability.dtos";

// --- Helper para la Lógica de Fechas ---
const getNextWeekDateForDay = (dayIndex: number): Date => {
    const now = new Date();
    const currentDay = now.getDay(); // 0 (Domingo) - 6 (Sábado)
    const daysUntilNextMonday = (8 - currentDay) % 7;
    const nextMonday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + daysUntilNextMonday);
    
    // Ajustamos para que el lunes sea el día 1 y domingo el 7
    const targetDay = dayIndex === 0 ? 7 : dayIndex;
    
    return new Date(nextMonday.getFullYear(), nextMonday.getMonth(), nextMonday.getDate() + targetDay - 1);
};

const dayNameToIndex: { [key: string]: number } = {
    domingo: 0, lunes: 1, martes: 2, miercoles: 3, jueves: 4, viernes: 5, sabado: 6
};
// --- Fin del Helper ---

export class CreateWeeklyScheduleUseCase {
  constructor(private readonly availabilityRepository: IAvailabilityRepository) {}

  async execute(dto: CreateWeeklyScheduleDto) {
    const { specialist_id, schedule } = dto;
    if (!specialist_id) {
        throw new Error("El ID del especialista es requerido para crear el horario.");
    }

    const slotsToCreate: { specialist_id: string, start_time: Date, end_time: Date }[] = [];
    let earliestDate: Date | null = null;
    let latestDate: Date | null = null;

    // 1. Generar los bloques de disponibilidad concretos para la próxima semana
    for (const dayName in schedule) {
        if (Object.prototype.hasOwnProperty.call(schedule, dayName)) {
            const dayIndex = dayNameToIndex[dayName.toLowerCase()];
            if (dayIndex === undefined) continue;

            const dateForDay = getNextWeekDateForDay(dayIndex);
            
            const timeSlots = (schedule as any)[dayName];
            for (const slot of timeSlots) {
                const [startHour, startMinute] = slot.start.split(':').map(Number);
                const [endHour, endMinute] = slot.end.split(':').map(Number);

                const startTime = new Date(dateForDay);
                startTime.setHours(startHour, startMinute, 0, 0);

                const endTime = new Date(dateForDay);
                endTime.setHours(endHour, endMinute, 0, 0);

                slotsToCreate.push({ specialist_id, start_time: startTime, end_time: endTime });

                // Mantener registro del rango de fechas para la validación
                if (!earliestDate || startTime < earliestDate) earliestDate = startTime;
                if (!latestDate || endTime > latestDate) latestDate = endTime;
            }
        }
    }

    if (slotsToCreate.length === 0) {
        throw new Error("El horario proporcionado no contiene ningún bloque de tiempo válido.");
    }

    // 2. Validar solapamientos con bloques existentes
    const existingAvailabilities = await this.availabilityRepository.findManyBySpecialistId(specialist_id, earliestDate!, latestDate!);
    
    for (const newSlot of slotsToCreate) {
        const isOverlapping = existingAvailabilities.some(existing => 
            (newSlot.start_time < existing.end_time) && (newSlot.end_time > existing.start_time)
        );
        if (isOverlapping) {
            throw new Error(`El horario propuesto para el día ${newSlot.start_time.toLocaleDateString()} se solapa con un bloque ya existente.`);
        }
    }

    // 3. Usar un nuevo método en el repositorio para crear todos los bloques en una transacción
    return this.availabilityRepository.createMany(slotsToCreate);
  }
}