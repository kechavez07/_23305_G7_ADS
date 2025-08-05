import { useEffect, useState } from 'react'
import type { UserAppointment } from '../types/appointment'
import {
  getMyAppointmentsService,
  reserveAppointmentService,
} from '../services/appointment'
import { useAuth } from './useAuth'

export function useUserAppointments() {
  const { authUser } = useAuth()
  const [appointments, setAppointments] = useState<UserAppointment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const appointments = await getMyAppointmentsService()
      setAppointments(appointments)
    } catch {
      setAppointments([])
    } finally {
      setLoading(false)
    }
  }

  const refetch = () => loadData()

  const reserveAppointment = async (availabilityId: string) => {
    if (!authUser) {
      return
    }

    await reserveAppointmentService({ availabilityId, patiendId: authUser.id })
    refetch()
  }

  return {
    appointments,
    loading,
    reserveAppointment,
  }
}
