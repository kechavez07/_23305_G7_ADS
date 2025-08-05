import { Availability } from "@prisma/client";
import { CreateAvailabilityDto } from "../../application/dtos/availability.dtos";
import { UpdateAvailabilityDto } from "../../application/dtos/availability.dtos";

export interface IAvailabilityRepository {
  /**
   * Crea un nuevo bloque de disponibilidad.
   * @param data - Datos de la nueva disponibilidad.
   * @returns El bloque de disponibilidad creado.
   */
  create(data: CreateAvailabilityDto): Promise<Availability>;

  /**
   * Encuentra la disponibilidad de un especialista en un rango de fechas.
   * @param specialistId - ID del especialista.
   * @param startDate - Fecha de inicio del rango.
   * @param endDate - Fecha de fin del rango.
   * @returns Un array de bloques de disponibilidad.
   */
  findManyBySpecialistId(specialistId: string, startDate: Date, endDate: Date): Promise<Availability[]>;
  
  /**
   * Encuentra un bloque de disponibilidad por su ID.
   * @param id - ID del bloque de disponibilidad.
   * @returns El bloque de disponibilidad o null si no se encuentra.
   */
  findById(id: string): Promise<Availability | null>;


    /**
     * Actualiza un bloque de disponibilidad por su ID.
     * @param id - ID del bloque de disponibilidad.
     * @param data - Nuevos datos para el bloque de disponibilidad.
     * @returns El bloque de disponibilidad actualizado.
     */
    update(id: string, data: UpdateAvailabilityDto): Promise<Availability>;

  /**
   * Elimina un bloque de disponibilidad por su ID.
   * @param id - ID del bloque de disponibilidad.
   * @returns El bloque de disponibilidad eliminado.
   */
  delete(id: string): Promise<Availability>;

  
  
  /**
   * 
   * @param data - Array de bloques de disponibilidad a crear.
   * @returns Un objeto con el conteo de bloques creados.
   */
  createMany(data: { specialist_id: string, start_time: Date, end_time: Date }[]): Promise<{ count: number }>;

}