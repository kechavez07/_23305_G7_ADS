import { IAvailabilityRepository } from "../../../domain/repositories/availability.repository";

export class GetAvailabilitiesBySpecialistUseCase {
  constructor(private readonly availabilityRepository: IAvailabilityRepository) {}

  async execute(specialistId: string, startDate: Date, endDate: Date) {
    return this.availabilityRepository.findManyBySpecialistId(specialistId, startDate, endDate);
  }
}