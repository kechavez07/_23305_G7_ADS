import { useMemo, useState } from 'react'
import { AppointmentCalendar } from '../components/calendars'
import { SpecialistSelect } from '../components/selects/SpecialistSelect'
import { useAvailabilities } from '../hooks/useAvailabilities'
import { useUserAppointments } from '../hooks/useUserAppointments'
import { formatHour, getEndWeek, getStartWeek } from '../utils/date'
import type {
  AppointmentEvent,
  AvailabilityEvent,
} from '../components/calendars/AppointmentCalendar'
import { MessageModal } from '../components/modals/MessageModal'
import { useMessageModal } from '../hooks/useMessageModal'

export function ScheduleAppointment() {
  const [specialistId, setSpecialtyId] = useState<string>('')

  const [availabilityRange, setAvailabilityRange] = useState({
    start: getStartWeek(),
    end: getEndWeek(),
  })

  const { availabilities, loading: loadingAvailabilities } = useAvailabilities({
    userId: specialistId,
    start: availabilityRange.start,
    end: availabilityRange.end,
  })

  const {
    appointments,
    loading: loadingAppointments,
    reserveAppointment,
  } = useUserAppointments()

  const { modal, closeModal, openModal } = useMessageModal({
    title: 'Agendar cita',
  })

  const handleSpecialtySelectChange = (id: string) => {
    setSpecialtyId(id)
  }

  const handleDateChange = async ({
    start,
    end,
  }: {
    start: Date
    end: Date
  }) => {
    setAvailabilityRange({ start, end })
  }

  const handleReserveAppointment = async (availabilityId: string) => {
    const resultMessage = {
      success:
        'La cita se reservó correctamente, a continuacion consulte en "Mis Citas" y cancele el valor de su cita por favor',
      error:
        'Ocurrio un error al reservar su cita, por favor, intentelo más tarde',
    }

    const modalButtons = [{ label: 'Aceptar', onClick: closeModal }]

    try {
      await reserveAppointment(availabilityId)
      openModal({
        buttons: modalButtons,
        message: resultMessage['success'],
        icon: 'success',
      })
    } catch {
      openModal({
        buttons: modalButtons,
        message: resultMessage['error'],
        icon: 'error',
      })
    }
  }

  const handleAvailabilitySelect = (availability: AvailabilityEvent) => {
    const { start, end } = availability

    openModal({
      icon: 'question',
      message: `¿Desea agendar su cita para esta fecha?: ${start.toLocaleDateString()} | ${formatHour(start)} - ${formatHour(end)}`,
      buttons: [
        {
          label: 'Aceptar',
          onClick: () => handleReserveAppointment(availability.id),
          style: 'success',
        },
        {
          label: 'Cancelar',
          onClick: closeModal,
          style: 'error',
        },
      ],
    })
  }

  const schedule = useMemo<AvailabilityEvent[]>(() => {
    return availabilities.map((availability) => ({
      end: availability.endTime,
      id: availability.id,
      isBooked: availability.isBooked,
      start: availability.startTime,
    }))
  }, [availabilities])

  const appointmentsEvents = useMemo<AppointmentEvent[]>(() => {
    return appointments
      .filter((a) => a.specialistId === specialistId)
      .map((appointment) => ({
        end: appointment.availability.endTime,
        id: appointment.id,
        start: appointment.availability.startTime,
        status: appointment.status,
      }))
  }, [appointments, specialistId])

  return (
    <main className="p-8 h-dvh">
      <h1 className="text-4xl font-semibold">Agendar cita</h1>
      <div className="mt-4">
        <SpecialistSelect onChange={handleSpecialtySelectChange} />
      </div>
      <div className="flex items-center justify-end gap-x-4 py-8">
        <AppointmentCalendar
          appointments={appointmentsEvents}
          schedule={schedule}
          loading={loadingAppointments || loadingAvailabilities}
          onDateChange={handleDateChange}
          onAvailabilitySelect={handleAvailabilitySelect}
        />
      </div>
      <MessageModal
        data={modal.data}
        buttons={modal.buttons}
        open={modal.open}
      />
    </main>
  )
}
