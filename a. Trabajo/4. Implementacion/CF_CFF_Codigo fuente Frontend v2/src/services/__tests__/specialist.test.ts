import {
  getSpecialistsService,
  createSpecialistService,
  updateSpecialistService,
  deleteSpecialistService,
} from '../specialist'

import * as api from '../../api/specialist'
import * as utils from '../../utils/specialist'
import type {
  CreateSpecialist,
  CreateSpecialistDto,
  Specialist,
  SpecialistDto,
  UpdateSpecialist,
  UpdateSpecialistDto,
} from '../../types/specialist'

import { describe, it, expect, vi, beforeEach } from 'vitest'

beforeEach(() => {
  vi.clearAllMocks()
})

describe('specialistService', () => {
  it('getSpecialistsService debería retornar especialistas mapeados', async () => {
    const mockDtos: SpecialistDto[] = [
      {
        id: '1',
        email: 'juan@correo.com',
        full_name: 'Juan Pérez',
        phone_number: '123456789',
        role: 'ESPECIALISTA',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        specialist_profile: {
          user_id: '1',
          specialty_id: 'esp-1',
          title: 'Dr.',
          created_at: new Date().toISOString(),
        },
      },
    ]

    const mapped: Specialist[] = [
      {
        id: '1',
        email: 'juan@correo.com',
        fullName: 'Juan Pérez',
        phoneNumber: '123456789',
        role: 'ESPECIALISTA',
        isActive: true,
        specialtyId: 'esp-1',
        title: 'Dr.',
      },
    ]

    vi.spyOn(api, 'getSpecialistsRequest').mockResolvedValue(mockDtos)
    vi.spyOn(utils, 'mapFromSpecialistDto').mockImplementation(() => mapped[0])

    const result = await getSpecialistsService()

    expect(api.getSpecialistsRequest).toHaveBeenCalled()
    expect(utils.mapFromSpecialistDto).toHaveBeenCalledTimes(1)
    expect(result).toEqual(mapped)
  })

  it('createSpecialistService debería crear y retornar un especialista', async () => {
    const input: CreateSpecialist = {
      email: 'ana@correo.com',
      fullName: 'Ana López',
      phoneNumber: '987654321',
      title: 'Dra.',
      specialtyId: 'esp-2',
    }

    const dto: CreateSpecialistDto = {
      email: 'ana@correo.com',
      full_name: 'Ana López',
      phone_number: '987654321',
      title: 'Dra.',
      specialty_id: 'esp-2',
    }

    const response: SpecialistDto = {
      id: '2',
      email: dto.email,
      full_name: dto.full_name,
      phone_number: dto.phone_number,
      role: 'ESPECIALISTA',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      specialist_profile: {
        user_id: '2',
        specialty_id: dto.specialty_id,
        title: dto.title,
        created_at: new Date().toISOString(),
      },
    }

    const mapped: Specialist = {
      id: '2',
      email: 'ana@correo.com',
      fullName: 'Ana López',
      phoneNumber: '987654321',
      role: 'ESPECIALISTA',
      isActive: true,
      specialtyId: 'esp-2',
      title: 'Dra.',
    }

    vi.spyOn(utils, 'mapToCreateSpecialistDto').mockReturnValue(dto)
    vi.spyOn(api, 'createSpecialistRequest').mockResolvedValue(response)
    vi.spyOn(utils, 'mapFromSpecialistDto').mockReturnValue(mapped)

    const result = await createSpecialistService(input)

    expect(utils.mapToCreateSpecialistDto).toHaveBeenCalledWith(input)
    expect(api.createSpecialistRequest).toHaveBeenCalledWith(dto)
    expect(result).toEqual(mapped)
  })

  it('updateSpecialistService debería actualizar y retornar un especialista', async () => {
    const id = '3'
    const update: UpdateSpecialist = {
      fullName: 'Carlos Ruiz',
      phoneNumber: '123123123',
      isActive: false,
      specialtyId: 'esp-3',
      title: 'Lic.',
    }

    const dto: UpdateSpecialistDto = {
      full_name: update.fullName,
      phone_number: update.phoneNumber,
      is_active: update.isActive,
      specialty_id: update.specialtyId,
      title: update.title,
    }

    const response: SpecialistDto = {
      id,
      email: 'carlos@correo.com',
      full_name: 'Carlos Ruiz',
      phone_number: '123123123',
      role: 'ESPECIALISTA',
      is_active: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      specialist_profile: {
        user_id: id,
        specialty_id: 'esp-3',
        title: 'Lic.',
        created_at: new Date().toISOString(),
      },
    }

    const mapped: Specialist = {
      id,
      email: 'carlos@correo.com',
      fullName: 'Carlos Ruiz',
      phoneNumber: '123123123',
      role: 'ESPECIALISTA',
      isActive: false,
      specialtyId: 'esp-3',
      title: 'Lic.',
    }

    vi.spyOn(utils, 'mapToUpdateSpecialistDto').mockReturnValue(dto)
    vi.spyOn(api, 'updateSpecialistRequest').mockResolvedValue(response)
    vi.spyOn(utils, 'mapFromSpecialistDto').mockReturnValue(mapped)

    const result = await updateSpecialistService(id, update)

    expect(utils.mapToUpdateSpecialistDto).toHaveBeenCalledWith(update)
    expect(api.updateSpecialistRequest).toHaveBeenCalledWith(id, dto)
    expect(result).toEqual(mapped)
  })

  it('deleteSpecialistService debería llamar correctamente al API', async () => {
    const id = '4'
    const mock = vi
      .spyOn(api, 'deleteSpecialistRequest')
      .mockResolvedValue(undefined)

    await deleteSpecialistService(id)

    expect(mock).toHaveBeenCalledWith(id)
  })
})
