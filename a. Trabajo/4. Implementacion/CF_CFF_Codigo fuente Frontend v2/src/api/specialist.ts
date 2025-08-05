import type {
  CreateSpecialistDto,
  SpecialistDto,
  UpdateSpecialistDto,
} from '../types/specialist'
import { buildApiRequestParams, type QueryParamsMapper } from '../utils/api'
import api from './api'

interface GetSpecialistsQueryParams {
  includeInactive?: boolean
}

export async function getSpecialistsRequest(
  queryParams?: GetSpecialistsQueryParams
): Promise<SpecialistDto[]> {
  const queryParamsMap: QueryParamsMapper<Required<GetSpecialistsQueryParams>> =
    {
      includeInactive: {
        param: 'include_inactive',
        value: queryParams?.includeInactive ?? true,
      },
    }

  const params = buildApiRequestParams(queryParamsMap)

  const response = await api.get('/specialists', { params })
  return response.data as SpecialistDto[]
}

export async function createSpecialistRequest(
  dto: CreateSpecialistDto
): Promise<SpecialistDto> {
  const response = await api.post('/specialists', dto)
  return response.data as SpecialistDto
}

export async function updateSpecialistRequest(
  id: string,
  dto: UpdateSpecialistDto
): Promise<SpecialistDto> {
  const response = await api.put(`/specialists/${id}`, dto)
  return response.data as SpecialistDto
}

export async function deleteSpecialistRequest(id: string): Promise<void> {
  await api.delete(`/specialists/${id}`)
}

export async function getSpecialistByIdRequest(
  id: string
): Promise<SpecialistDto> {
  const response = await api.get(`/specialists/${id}`)
  return response.data as SpecialistDto
}
