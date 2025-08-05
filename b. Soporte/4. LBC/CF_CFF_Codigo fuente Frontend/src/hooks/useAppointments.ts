import { useEffect, useState } from 'react'
import {
  getMyAppointmentsService,
  reserveAppointmentService,
} from '../services/appointment'
import { useAuth } from './useAuth'
import type { Appointment } from '../types/appointment'

export function useAppointments() {
  const { authUser } = useAuth()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getMyAppointmentsService()
      .then((a) => setAppointments(a))
      .catch(() => setAppointments([]))
      .finally(() => setLoading(false))
  }, [])

  const reserveAppointment = async (availabilityId: string) => {
    // TODO: create service to reserve appointment
    if (!authUser) {
      return
    }

    await reserveAppointmentService({
      availabilityId,
      patiendId: authUser.id,
    })
  }
  return {
    appointments,
    loading,
    reserveAppointment,
  }
}
