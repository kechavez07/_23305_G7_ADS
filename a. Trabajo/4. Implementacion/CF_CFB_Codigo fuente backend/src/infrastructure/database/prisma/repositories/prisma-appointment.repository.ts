import { IAppointmentRepository } from "../../../../domain/repositories/appointment.repository";
import { CreateAppointmentDto } from "../../../../application/dtos/appointment.dtos";
import { Appointment } from "@prisma/client";
import prisma from "../prisma.service";

export class PrismaAppointmentRepository implements IAppointmentRepository {
  async create(data: CreateAppointmentDto, availabilityId: string): Promise<Appointment> {
    // Usamos una transacción para asegurar la atomicidad de la operación
    return prisma.$transaction(async (tx) => {
      // 1. Intentar actualizar (bloquear) el bloque de disponibilidad
      // Se añade una condición 'where' para asegurarse de que no ha sido reservado
      const updatedAvailability = await tx.availability.update({
        where: {
          id: availabilityId,
          is_booked: false, // ¡Condición clave para evitar 'race conditions'!
        },
        data: {
          is_booked: true,
        },
      });

      // Si el update falla porque is_booked ya era true, Prisma lanzará un error que la transacción revertirá.

      // 2. Si el bloqueo fue exitoso, crear la cita
      const newAppointment = await tx.appointment.create({
        data: {
          patient_id: data.patient_id,
          specialist_id: data.specialist_id,
          availability_id: updatedAvailability.id,
          status: 'RESERVADA' // Estado inicial
        },
      });

      return newAppointment;
    });
  }

  async findManyByPatientId(patientId: string): Promise<Appointment[]> {
    return prisma.appointment.findMany({
      where: { patient_id: patientId },
      include: {
        // Incluimos datos relacionados que pueden ser útiles para el frontend
        specialist: {
            select: { full_name: true, specialist_profile: { include: { specialty: { select: { name: true } } } } }
        },
        availability: {
            select: { start_time: true, end_time: true }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    });
  }
}