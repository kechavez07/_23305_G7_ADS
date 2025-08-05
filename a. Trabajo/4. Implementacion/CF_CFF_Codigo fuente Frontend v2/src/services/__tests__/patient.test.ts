import { registerPatient } from '../patient'
import * as api from '../../api/patient'
import * as utils from '../../utils/patient'
import type {
  RegistratePatient,
  RegistratePatientDto,
} from '../../types/patient'

import { describe, it, expect, vi, beforeEach } from 'vitest'

beforeEach(() => {
  vi.clearAllMocks()
})

describe('registerPatient', () => {
  it('debería registrar correctamente al paciente', async () => {
    const registration: RegistratePatient = {
      email: 'lucia@mail.com',
      fullName: 'Lucía Gómez',
      phoneNumber: '555123456',
      patient: {
        fullName: 'Lucía Gómez',
        age: 30,
        sex: 'FEMENINO',
        condition: 'Hipertensión',
      },
    }

    const dto: RegistratePatientDto = {
      email: registration.email,
      full_name: registration.fullName,
      phone_number: registration.phoneNumber,
      patient: {
        full_name: registration.patient.fullName,
        age: registration.patient.age,
        gender: registration.patient.sex,
        condition: registration.patient.condition,
      },
    }

    vi.spyOn(utils, 'mapToRegistratePatientDto').mockReturnValue(dto)
    const apiMock = vi
      .spyOn(api, 'registerPatientRequest')
      .mockResolvedValue(undefined)

    await registerPatient(registration)

    expect(utils.mapToRegistratePatientDto).toHaveBeenCalledWith(registration)
    expect(apiMock).toHaveBeenCalledWith(dto)
  })

  it('debería lanzar un error si el registro falla', async () => {
    const registration: RegistratePatient = {
      email: 'lucia@mail.com',
      fullName: 'Lucía Gómez',
      phoneNumber: '555123456',
      patient: {
        fullName: 'Lucía Gómez',
        age: 30,
        sex: 'FEMENINO',
        condition: 'Hipertensión',
      },
    }

    vi.spyOn(utils, 'mapToRegistratePatientDto').mockImplementation(() => {
      throw new Error('Error en el mapeo')
    })

    await expect(registerPatient(registration)).rejects.toThrow(
      'El usuario no pudo ser registrado'
    )
  })
})
