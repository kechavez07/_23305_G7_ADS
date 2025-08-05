import { getSpecialtyByIdService } from '../services/specialty'
import { useDataCache } from './useDataCache'

export function useSpecialtyCache(specialtyIds?: string[]) {
  const { getValue, getValues, loadValue } = useDataCache({
    initialIds: specialtyIds,
    getValueAsync: getSpecialtyByIdService,
  })

  return {
    loadSpecialty: loadValue,
    getSpecialty: getValue,
    getSpecialties: getValues,
  }
}
