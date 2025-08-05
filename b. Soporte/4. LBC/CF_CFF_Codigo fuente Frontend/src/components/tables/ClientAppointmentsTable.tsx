import type { UserAppointment } from '../../types/appointment'
import {
  getAppointmentStatusColor,
  getAppointmentStatusLabel,
} from '../../utils/appointment'
import { formatHour } from '../../utils/date'
import { IconFactory } from '../factory/IconFactory'

interface Props {
  appointments: UserAppointment[]
  loading?: boolean
}

const COLUMNS = 5

export function ClientAppointmentsTable({ appointments, loading }: Props) {
  return (
    <div className="table-x-scroll">
      <table className="table">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Especialista</th>
            <th className="column-center">Estado</th>
            <th className="column-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={COLUMNS}>
                <span className="inline-flex items-center gap-x-2">
                  <IconFactory name="loading" className="animate-spin" />{' '}
                  Cargando
                </span>
              </td>
            </tr>
          ) : appointments.length ? (
            appointments.map((appointment) => (
              <tr key={appointment.id}>
                <td>
                  {appointment.availability.startTime.toLocaleDateString()}
                </td>
                <td>
                  {formatHour(appointment.availability.startTime)} -{' '}
                  {formatHour(appointment.availability.endTime)}
                </td>
                <td>{appointment.specialistName}</td>
                <td className="column-center">
                  <span
                    className={`rounded-xl px-2 py-1`}
                    style={{
                      backgroundColor: getAppointmentStatusColor(
                        appointment.status
                      ),
                    }}
                  >
                    {getAppointmentStatusLabel(appointment.status)}
                  </span>
                </td>
                <td>
                  <div className="flex gap-x-3 items-center justify-center">
                    <button
                      className="p-2 bg-red-500 rounded-md"
                      type="button"
                      title="Cancelar cita"
                    >
                      <IconFactory
                        name="scheduleCancel"
                        className="text-white w-[12px] h-[12px]"
                      />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={COLUMNS}>No hay citas registradas</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
