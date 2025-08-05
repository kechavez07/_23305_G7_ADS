import type {
  AvailabilityDto,
  CreateAvailabilityDto,
  UpdateAvailabilityDto,
} from '../types/availability'
import { buildApiRequestParams, type QueryParamsMapper } from '../utils/api'
import api from './api'

interface GetAvailabilityBySpecialistIdParams {
  start: Date
  end: Date
}

export async function getAvailabilityBySpecialistIdRequest(
  specialistId: string,
  { start, end }: GetAvailabilityBySpecialistIdParams
): Promise<AvailabilityDto[]> {
  const dateToString = (date: Date) => date.toISOString()

  const paramsMap: QueryParamsMapper<GetAvailabilityBySpecialistIdParams> = {
    end: {
      param: 'end',
      value: end,
      parser: dateToString,
    },
    start: {
      param: 'start',
      value: start,
      parser: dateToString,
    },
  }

  const params = buildApiRequestParams(paramsMap)

  const response = await api.get(`/availabilities/specialist/${specialistId}`, {
    params,
  })

  return response.data as AvailabilityDto[]
}

export async function createAvailabilityRequest(
  dto: CreateAvailabilityDto
): Promise<AvailabilityDto> {
  const response = await api.post('/availabilities', dto)
  return response.data as AvailabilityDto
}

export async function updateAvailabilityRequest(
  id: string,
  dto: UpdateAvailabilityDto
): Promise<AvailabilityDto> {
  const response = await api.put(`/availabilities/${id}`, dto)
  return response.data as AvailabilityDto
}

export async function deleteAvailabilityRequest(id: string): Promise<void> {
  await api.delete(`/availabilities/${id}`)
}
