import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as api from '../../api/availability'
import * as utils from '../../utils/availability'
import * as dateUtils from '../../utils/date'
import {
  getAvailablityBySpecialistIdService,
  createAvailabilityService,
  updateAvailabilityService,
  deleteAvailabilityService,
} from '../availability'

import type {
  AvailabilityDto,
  Availability,
  CreateAvailability,
  UpdateAvailability,
} from '../../types/availability'

beforeEach(() => {
  vi.clearAllMocks()
})

describe('availabilityService', () => {
  describe('getAvailablityBySpecialistIdService', () => {
    it('debería obtener las disponibilidades del especialista correctamente', async () => {
      const specialistId = 'spec-1'
      const start = new Date('2025-07-01')
      const end = new Date('2025-07-07')

      const dtos: AvailabilityDto[] = [
        {
          id: '1',
          specialist_id: specialistId,
          start_time: '2025-07-01T10:00:00Z',
          end_time: '2025-07-01T11:00:00Z',
          is_booked: false,
          created_at: '2025-06-30T12:00:00Z',
        },
      ]

      const mapped: Availability[] = [
        {
          id: '1',
          specialistId,
          startTime: new Date('2025-07-01T10:00:00Z'),
          endTime: new Date('2025-07-01T11:00:00Z'),
          isBooked: false,
          createdAt: new Date('2025-06-30T12:00:00Z'),
        },
      ]

      vi.spyOn(api, 'getAvailabilityBySpecialistIdRequest').mockResolvedValue(
        dtos
      )
      vi.spyOn(utils, 'mapFromAvailabilityDto').mockImplementation(
        () => mapped[0]
      )

      const result = await getAvailablityBySpecialistIdService(specialistId, {
        start,
        end,
      })

      expect(api.getAvailabilityBySpecialistIdRequest).toHaveBeenCalledWith(
        specialistId,
        { start, end }
      )
      expect(result).toEqual(mapped)
    })

    it('debería usar fechas por defecto si no se proporcionan', async () => {
      const specialistId = 'spec-1'
      const start = new Date('2025-07-01')
      const end = new Date('2025-07-07')

      const dtos: AvailabilityDto[] = []

      vi.spyOn(dateUtils, 'getStartWeek').mockReturnValue(start)
      vi.spyOn(dateUtils, 'getEndWeek').mockReturnValue(end)
      vi.spyOn(api, 'getAvailabilityBySpecialistIdRequest').mockResolvedValue(
        dtos
      )
      vi.spyOn(utils, 'mapFromAvailabilityDto').mockImplementation((dto) => {
        return {
          id: dto.id,
          specialistId: dto.specialist_id,
          startTime: new Date(dto.start_time),
          endTime: new Date(dto.end_time),
          isBooked: dto.is_booked,
          createdAt: new Date(dto.created_at),
        }
      })

      const result = await getAvailablityBySpecialistIdService(specialistId)

      expect(dateUtils.getStartWeek).toHaveBeenCalled()
      expect(dateUtils.getEndWeek).toHaveBeenCalled()
      expect(api.getAvailabilityBySpecialistIdRequest).toHaveBeenCalledWith(
        specialistId,
        { start, end }
      )
      expect(result).toEqual([])
    })

    it('debería lanzar error si la API falla', async () => {
      const specialistId = 'spec-1'
      vi.spyOn(api, 'getAvailabilityBySpecialistIdRequest').mockRejectedValue(
        new Error('fail')
      )

      await expect(
        getAvailablityBySpecialistIdService(specialistId)
      ).rejects.toThrow('El usuario no tiene registrado ningun horario')
    })
  })

  describe('createAvailabilityService', () => {
    it('debería crear una disponibilidad correctamente', async () => {
      const input: CreateAvailability = {
        startTime: new Date('2025-07-10T08:00:00Z'),
        endTime: new Date('2025-07-10T09:00:00Z'),
      }

      const dto = {
        start_time: input.startTime.toISOString(),
        end_time: input.endTime.toISOString(),
      }

      const resultDto: AvailabilityDto = {
        id: 'a1',
        specialist_id: 's1',
        start_time: dto.start_time,
        end_time: dto.end_time,
        is_booked: false,
        created_at: new Date().toISOString(),
      }

      const expected: Availability = {
        id: 'a1',
        specialistId: 's1',
        startTime: new Date(dto.start_time),
        endTime: new Date(dto.end_time),
        isBooked: false,
        createdAt: new Date(resultDto.created_at),
      }

      vi.spyOn(utils, 'mapToCreateAvailabilityDto').mockReturnValue(dto)
      vi.spyOn(api, 'createAvailabilityRequest').mockResolvedValue(resultDto)
      vi.spyOn(utils, 'mapFromAvailabilityDto').mockReturnValue(expected)

      const result = await createAvailabilityService(input)

      expect(utils.mapToCreateAvailabilityDto).toHaveBeenCalledWith(input)
      expect(api.createAvailabilityRequest).toHaveBeenCalledWith(dto)
      expect(result).toEqual(expected)
    })

    it('debería lanzar error si falla la creación', async () => {
      const input: CreateAvailability = {
        startTime: new Date(),
        endTime: new Date(),
      }

      vi.spyOn(utils, 'mapToCreateAvailabilityDto').mockReturnValue({
        start_time: input.startTime.toISOString(),
        end_time: input.endTime.toISOString(),
      })

      vi.spyOn(api, 'createAvailabilityRequest').mockRejectedValue(
        new Error('fail')
      )

      await expect(createAvailabilityService(input)).rejects.toThrow(
        'No se pudo registrar el horario'
      )
    })
  })

  describe('updateAvailabilityService', () => {
    it('debería actualizar una disponibilidad correctamente', async () => {
      const id = 'a1'
      const input: UpdateAvailability = {
        startTime: new Date(),
        endTime: new Date(),
      }

      const dto = {
        start_time: input.startTime.toISOString(),
        end_time: input.endTime.toISOString(),
      }

      const resultDto: AvailabilityDto = {
        id,
        specialist_id: 's1',
        start_time: dto.start_time,
        end_time: dto.end_time,
        is_booked: false,
        created_at: new Date().toISOString(),
      }

      const expected: Availability = {
        id,
        specialistId: 's1',
        startTime: new Date(dto.start_time),
        endTime: new Date(dto.end_time),
        isBooked: false,
        createdAt: new Date(resultDto.created_at),
      }

      vi.spyOn(utils, 'mapToUpdateAvailabilityDto').mockReturnValue(dto)
      vi.spyOn(api, 'updateAvailabilityRequest').mockResolvedValue(resultDto)
      vi.spyOn(utils, 'mapFromAvailabilityDto').mockReturnValue(expected)

      const result = await updateAvailabilityService(id, input)

      expect(result).toEqual(expected)
    })

    it('debería lanzar error si falla la actualización', async () => {
      const id = 'a1'
      const input: UpdateAvailability = {
        startTime: new Date(),
        endTime: new Date(),
      }

      vi.spyOn(utils, 'mapToUpdateAvailabilityDto').mockReturnValue({
        start_time: input.startTime.toISOString(),
        end_time: input.endTime.toISOString(),
      })

      vi.spyOn(api, 'updateAvailabilityRequest').mockRejectedValue(
        new Error('fail')
      )

      await expect(updateAvailabilityService(id, input)).rejects.toThrow(
        'No se pudo actualizar el horario del especialista'
      )
    })
  })

  describe('deleteAvailabilityService', () => {
    it('debería eliminar una disponibilidad correctamente', async () => {
      const id = 'a1'
      vi.spyOn(api, 'deleteAvailabilityRequest').mockResolvedValue(undefined)

      await deleteAvailabilityService(id)

      expect(api.deleteAvailabilityRequest).toHaveBeenCalledWith(id)
    })

    it('debería lanzar error si falla la eliminación', async () => {
      const id = 'a1'
      vi.spyOn(api, 'deleteAvailabilityRequest').mockRejectedValue(
        new Error('fail')
      )

      await expect(deleteAvailabilityService(id)).rejects.toThrow(
        'No se pudo eliminar el horario de disponibilidad'
      )
    })
  })
})
