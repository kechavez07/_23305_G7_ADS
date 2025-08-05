import { ClientAppointmentsTable } from '../components/tables/ClientAppointmentsTable'
import { useUserAppointments } from '../hooks/useUserAppointments'

export function ClientAppointments() {
  const { appointments, loading } = useUserAppointments()

  return (
    <main className="p-8">
      <h1 className="text-4xl font-semibold">Mis Citas</h1>
      <div className="flex justify-between items-center py-8">
        <ClientAppointmentsTable
          appointments={appointments}
          loading={loading}
        />
      </div>
    </main>
  )
}
