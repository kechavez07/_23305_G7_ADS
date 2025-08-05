import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import esLocale from '@fullcalendar/core/locales/es'
import type {
  AllowFunc,
  DateSelectArg,
  DurationInput,
} from '@fullcalendar/core/index.js'
import { useRef } from 'react'
import { IconFactory } from '../factory/IconFactory'

export interface ScheduleEvent {
  id: string
  start: Date
  end: Date
  color?: string
}

interface Props {
  events?: ScheduleEvent[]
  editable?: boolean
  loading?: boolean
  minTime?: DurationInput
  maxTime?: DurationInput
  onSelect?: (arg: { start: Date; end: Date }) => Promise<void> | void
}

export function Schedule({
  events,
  editable = false,
  loading = false,
  minTime = '05:00:00',
  maxTime = '21:00:00',
  onSelect,
}: Props) {
  const ref = useRef<FullCalendar>(null)

  const handleSelectAllow: AllowFunc = ({ start, end }) => {
    const isSameDay = start.getDay() === end.getDay()
    return isSameDay
  }

  const handleDateSelect = ({ start, end }: DateSelectArg) => {
    onSelect?.({ start, end })
  }

  return (
    <div className="relative">
      {loading && (
        <span className="absolute top-0 bottom-0 left-0 right-0 items-center justify-center gap-x-2 flex z-10 pointer-events-non backdrop-blur-xs">
          <IconFactory name="loading" className="animate-spin" />{' '}
          <p>Cargando</p>
        </span>
      )}
      <FullCalendar
        ref={ref}
        plugins={[timeGridPlugin, interactionPlugin]}
        locale={esLocale}
        initialView="timeGridWeek"
        firstDay={0}
        allDaySlot={false}
        headerToolbar={false}
        dayHeaderFormat={{ weekday: 'long' }}
        slotLabelFormat={{ hour: '2-digit', minute: '2-digit', hour12: false }}
        slotMinTime={minTime}
        slotMaxTime={maxTime}
        height={'auto'}
        stickyHeaderDates={false}
        selectOverlap={false}
        selectable={editable}
        selectAllow={handleSelectAllow}
        select={handleDateSelect}
        events={events}
      />
    </div>
  )
}
