import {
  getSpecialtiesRequest,
  createSpecialtyRequest,
  updateSpecialtyRequest,
  deleteSpecialtyRequest,
  getSpecialtyByIdRequest,
} from '../api/specialty'
import type { CreateSpecialty, UpdateSpecialty } from '../types/specialty'
import {
  mapFromSpecialtyDto,
  mapToCreateSpecialtyDto,
  mapToUpdateSpecialtyDto,
} from '../utils/specialty'

interface GetSpecialtiesOptions {
  includeInactive?: boolean
}

export async function getSpecialtiesService(options?: GetSpecialtiesOptions) {
  try {
    const dtos = await getSpecialtiesRequest(options)
    return dtos.map(mapFromSpecialtyDto)
  } catch {
    throw new Error('No se pudo obtener las especialidades')
  }
}

export async function createSpecialtyService(newSpecialty: CreateSpecialty) {
  try {
    const dto = mapToCreateSpecialtyDto(newSpecialty)
    const result = await createSpecialtyRequest(dto)
    return mapFromSpecialtyDto(result)
  } catch {
    throw new Error('No se pudo crear la especialidad')
  }
}

export async function updateSpecialtyService(
  id: string,
  updatedSpecialty: UpdateSpecialty
) {
  try {
    const dto = mapToUpdateSpecialtyDto(updatedSpecialty)
    const result = await updateSpecialtyRequest(id, dto)
    return mapFromSpecialtyDto(result)
  } catch {
    throw new Error('No se pudo actualizar la especialidad')
  }
}

export async function deleteSpecialtyService(id: string) {
  try {
    await deleteSpecialtyRequest(id)
  } catch {
    throw new Error('No se pudo eliminar la especialidad')
  }
}

export async function getSpecialtyByIdService(id: string) {
  try {
    const result = await getSpecialtyByIdRequest(id)
    return mapFromSpecialtyDto(result)
  } catch {
    throw new Error(`No se encontro la especialidad con el id ${id}`)
  }
}
