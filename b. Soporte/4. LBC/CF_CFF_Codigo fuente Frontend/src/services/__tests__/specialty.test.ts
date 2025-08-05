import {
  getSpecialtiesService,
  createSpecialtyService,
  updateSpecialtyService,
  deleteSpecialtyService,
  getSpecialtyByIdService,
} from '../specialty'

import * as api from '../../api/specialty'
import * as utils from '../../utils/specialty'
import type {
  CreateSpecialty,
  CreateSpecialtyDto,
  Specialty,
  SpecialtyDto,
  UpdateSpecialty,
  UpdateSpecialtyDto,
} from '../../types/specialty'

import { describe, it, expect, vi, beforeEach } from 'vitest'

beforeEach(() => {
  vi.clearAllMocks()
})

describe('specialtyService', () => {
  it('getSpecialtiesService debería retornar las especialidades mapeadas', async () => {
    const mockDtos: SpecialtyDto[] = [
      {
        id: '1',
        name: 'Cardiología',
        description: 'Especialidad del corazón',
        is_active: true,
        created_at: new Date(),
      },
    ]

    const mapped: Specialty[] = [
      {
        id: '1',
        name: 'Cardiología',
        description: 'Especialidad del corazón',
        isActive: true,
      },
    ]

    vi.spyOn(api, 'getSpecialtiesRequest').mockResolvedValue(mockDtos)
    vi.spyOn(utils, 'mapFromSpecialtyDto').mockImplementation((dto) => ({
      id: dto.id,
      name: dto.name,
      description: dto.description,
      isActive: dto.is_active,
    }))

    const result = await getSpecialtiesService()

    expect(api.getSpecialtiesRequest).toHaveBeenCalled()
    expect(utils.mapFromSpecialtyDto).toHaveBeenCalledTimes(1)
    expect(result).toEqual(mapped)
  })

  it('createSpecialtyService debería crear y retornar una especialidad', async () => {
    const input: CreateSpecialty = {
      name: 'Neurología',
      description: 'Sistema nervioso',
    }

    const dto: CreateSpecialtyDto = { ...input }

    const response: SpecialtyDto = {
      id: '2',
      name: 'Neurología',
      description: 'Sistema nervioso',
      is_active: true,
      created_at: new Date(),
    }

    const mapped: Specialty = {
      id: '2',
      name: 'Neurología',
      description: 'Sistema nervioso',
      isActive: true,
    }

    vi.spyOn(utils, 'mapToCreateSpecialtyDto').mockReturnValue(dto)
    vi.spyOn(api, 'createSpecialtyRequest').mockResolvedValue(response)
    vi.spyOn(utils, 'mapFromSpecialtyDto').mockReturnValue(mapped)

    const result = await createSpecialtyService(input)

    expect(utils.mapToCreateSpecialtyDto).toHaveBeenCalledWith(input)
    expect(api.createSpecialtyRequest).toHaveBeenCalledWith(dto)
    expect(result).toEqual(mapped)
  })

  it('updateSpecialtyService debería actualizar y retornar la especialidad', async () => {
    const id = '3'
    const update: UpdateSpecialty = {
      name: 'Pediatría',
      description: 'Atención infantil',
    }

    const dto: UpdateSpecialtyDto = { ...update }

    const response: SpecialtyDto = {
      id,
      name: 'Pediatría',
      description: 'Atención infantil',
      is_active: true,
      created_at: new Date(),
    }

    const mapped: Specialty = {
      id,
      name: 'Pediatría',
      description: 'Atención infantil',
      isActive: true,
    }

    vi.spyOn(utils, 'mapToUpdateSpecialtyDto').mockReturnValue(dto)
    vi.spyOn(api, 'updateSpecialtyRequest').mockResolvedValue(response)
    vi.spyOn(utils, 'mapFromSpecialtyDto').mockReturnValue(mapped)

    const result = await updateSpecialtyService(id, update)

    expect(api.updateSpecialtyRequest).toHaveBeenCalledWith(id, dto)
    expect(result).toEqual(mapped)
  })

  it('deleteSpecialtyService debería llamar a la API con el id correcto', async () => {
    const id = '4'
    const mock = vi
      .spyOn(api, 'deleteSpecialtyRequest')
      .mockResolvedValue(undefined)

    await deleteSpecialtyService(id)

    expect(mock).toHaveBeenCalledWith(id)
  })

  it('getSpecialtyByIdService debería retornar una especialidad mapeada', async () => {
    const id = '5'
    const response: SpecialtyDto = {
      id,
      name: 'Dermatología',
      description: 'Piel y anexos',
      is_active: false,
      created_at: new Date(),
    }

    const mapped: Specialty = {
      id,
      name: 'Dermatología',
      description: 'Piel y anexos',
      isActive: false,
    }

    vi.spyOn(api, 'getSpecialtyByIdRequest').mockResolvedValue(response)
    vi.spyOn(utils, 'mapFromSpecialtyDto').mockReturnValue(mapped)

    const result = await getSpecialtyByIdService(id)

    expect(api.getSpecialtyByIdRequest).toHaveBeenCalledWith(id)
    expect(result).toEqual(mapped)
  })
})
