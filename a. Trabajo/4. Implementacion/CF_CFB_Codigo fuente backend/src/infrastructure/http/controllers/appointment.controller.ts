import { Request, Response } from "express";
import { ReserveAppointmentUseCase } from "../../../application/use-cases/appointment/reserve-appointment.use-case";
import { GetMyAppointmentsUseCase } from "../../../application/use-cases/appointment/get-my-appointments.use-case";
import { ReserveAppointmentSchema } from "../../../application/dtos/appointment.dtos";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { Patient } from "@prisma/client";
import { z } from "zod";

export class AppointmentController {
  constructor(
    private readonly reserveAppointmentUseCase: ReserveAppointmentUseCase,
    private readonly getMyAppointmentsUseCase: GetMyAppointmentsUseCase,
    private readonly userRepository: IUserRepository // Para obtener el paciente
  ) {}

  async reserve(req: Request, res: Response): Promise<void> {
    try {
      const { availability_id } = ReserveAppointmentSchema.parse(req.body);
      const clientId = req.user!.id;
      
      // Encontrar el paciente asociado al cliente que hace la petición
      const clientUser = await this.userRepository.findById(clientId);
       if (!clientUser || !clientUser.representative_for || clientUser.representative_for.length === 0) {
        res.status(404).json({ message: "No se encontró un paciente asociado a esta cuenta de cliente." });
        return;
      }
      const patient = clientUser.representative_for[0] as Patient;

      const appointment = await this.reserveAppointmentUseCase.execute({
        availabilityId: availability_id,
        patientId: patient.id
      });
      
      res.status(201).json(appointment);
    } catch (error: any) {
        res.status(409).json({ message: error.message });
    }
  }

  async getMine(req: Request, res: Response): Promise<void> {
    try {
        const clientId = req.user!.id;
        const appointments = await this.getMyAppointmentsUseCase.execute(clientId);
        res.status(200).json(appointments);
    } catch (error: any) {
        res.status(404).json({ message: error.message });
    }
  }
}