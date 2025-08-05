import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import esLocale from '@fullcalendar/core/locales/es'
import { useMemo, useRef } from 'react'
import { IconFactory } from '../factory/IconFactory'
import type { DateSelectArg, DatesSetArg } from '@fullcalendar/core/index.js'
import type { AppointmentStatus } from '../../types/appointment'
import {
  getAppointmentStatusColor,
  getAppointmentStatuses,
} from '../../utils/appointment'
import { getAvailabilityStatusColor } from '../../utils/availability'

interface Event {
  id: string
  start: Date
  end: Date
}

export interface AppointmentEvent extends Event {
  status: AppointmentStatus
}

export interface AvailabilityEvent extends Event {
  isBooked: boolean
}

type CalendarEvent = (
  | (AppointmentEvent & { type: 'appointment' })
  | (AvailabilityEvent & { type: 'availability' })
) & {
  color: string
  display: 'auto' | 'background'
}

interface Props {
  appointments: AppointmentEvent[]
  schedule: AvailabilityEvent[]
  loading?: boolean
  minTime?: string
  maxTime?: string
  onDateChange?: ({ start, end }: { start: Date; end: Date }) => Promise<void>
  onAvailabilitySelect?: (availability: AvailabilityEvent) => void
}

export function AppointmentCalendar({
  schedule,
  appointments,
  loading = false,
  minTime = '05:00:00',
  maxTime = '21:00:00',
  onDateChange,
  onAvailabilitySelect,
}: Props) {
  const ref = useRef<FullCalendar>(null)

  const handleNavLinkDay = async (date: Date) => {
    const calendarApi = ref.current?.getApi()
    if (!calendarApi) return

    const currentView = calendarApi.view.type
    const isWeekView = currentView === 'timeGridWeek'

    const nextView = isWeekView ? 'timeGridDay' : 'timeGridWeek'
    calendarApi.changeView(nextView, date)
  }

  const handleDateChange = async (arg: DatesSetArg) => {
    await onDateChange?.({ start: arg.start, end: arg.end })
  }

  const handleSelect = (info: DateSelectArg) => {
    const calendarApi = ref.current?.getApi()
    if (!calendarApi) return

    const currentView = calendarApi.view.type
    if (currentView !== 'timeGridWeek') {
      calendarApi.unselect()
      return
    }

    const selectedStart = info.start
    const selectedEnd = info.end

    const matchingAvailability = schedule.find((availability) => {
      return (
        !availability.isBooked &&
        availability.start <= selectedStart &&
        availability.end >= selectedEnd
      )
    })

    if (matchingAvailability) {
      onAvailabilitySelect?.(matchingAvailability)
    }

    calendarApi.unselect()
  }

  const events = useMemo<CalendarEvent[]>(() => {
    const appointmentsEvents: CalendarEvent[] = appointments.map(
      (appointment) => ({
        ...appointment,
        color: getAppointmentStatusColor(appointment.status),
        display: 'auto',
        type: 'appointment',
      })
    )

    const availabilitiesEvents: CalendarEvent[] = schedule.map(
      (availability) => ({
        ...availability,
        color: getAvailabilityStatusColor(availability.isBooked),
        display: 'background',
        type: 'availability',
      })
    )

    return [...appointmentsEvents, ...availabilitiesEvents]
  }, [schedule, appointments])

  return (
    <div className="relative">
      <div className="flex flex-row gap-x-3 flex-wrap mb-4">
        {getAppointmentStatuses().map(({ color, label }) => (
          <div key={label} className="flex flex-row items-center gap-x-1">
            <IconFactory name="square" color={color} />
            <span>{label}</span>
          </div>
        ))}
      </div>

      {loading && (
        <span className="absolute top-0 bottom-0 left-0 right-0 items-center justify-center gap-x-2 flex z-10 pointer-events-non backdrop-blur-xs">
          <IconFactory name="loading" className="animate-spin" />{' '}
          <p>Cargando</p>
        </span>
      )}
      <FullCalendar
        ref={ref}
        headerToolbar={{
          left: 'dayGridMonth timeGridWeek',
          center: 'title',
          right: 'today prev next',
        }}
        plugins={[timeGridPlugin, interactionPlugin, dayGridPlugin]}
        locale={esLocale}
        initialView="timeGridWeek"
        firstDay={0}
        allDaySlot={false}
        height={'auto'}
        slotLabelFormat={{ hour: '2-digit', minute: '2-digit', hour12: false }}
        eventOrder={'isBooked'}
        slotMinTime={minTime}
        slotMaxTime={maxTime}
        stickyHeaderDates={false}
        navLinks
        navLinkDayClick={handleNavLinkDay}
        datesSet={handleDateChange}
        selectable={true}
        select={handleSelect}
        events={events}
      />
    </div>
  )
}
