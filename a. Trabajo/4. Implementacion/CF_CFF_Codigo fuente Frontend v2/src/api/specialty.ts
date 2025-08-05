import type {
  CreateSpecialtyDto,
  SpecialtyDto,
  UpdateSpecialtyDto,
} from '../types/specialty'
import { buildApiRequestParams, type QueryParamsMapper } from '../utils/api'
import api from './api'

interface GetSpecialistsQueryParams {
  includeInactive?: boolean
}

export async function getSpecialtiesRequest(
  queryParams?: GetSpecialistsQueryParams
): Promise<SpecialtyDto[]> {
  const queryParamsMap: QueryParamsMapper<Required<GetSpecialistsQueryParams>> =
    {
      includeInactive: {
        param: 'include_inactive',
        value: queryParams?.includeInactive ?? true,
      },
    }

  const params = buildApiRequestParams(queryParamsMap)
  const response = await api.get('/specialties', { params })
  return response.data as SpecialtyDto[]
}

export async function createSpecialtyRequest(
  dto: CreateSpecialtyDto
): Promise<SpecialtyDto> {
  const response = await api.post('/specialties', dto)
  return response.data as SpecialtyDto
}

export async function updateSpecialtyRequest(
  id: string,
  dto: UpdateSpecialtyDto
): Promise<SpecialtyDto> {
  const response = await api.put(`/specialties/${id}`, dto)
  return response.data as SpecialtyDto
}

export async function deleteSpecialtyRequest(id: string): Promise<void> {
  await api.delete(`/specialties/${id}`)
}

export async function getSpecialtyByIdRequest(
  id: string
): Promise<SpecialtyDto> {
  const response = await api.get(`/specialties/${id}`)
  return response.data as SpecialtyDto
}
