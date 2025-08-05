import { Route, Routes } from 'react-router'
import './App.css'
import {
  AdminHome,
  Availability,
  ClientAppointments,
  ClientHome,
  Login,
  NotFound,
  Register,
  ScheduleAppointment,
  SpecialistHome,
  Specialists,
  Specialties,
} from './pages'
import {
  AdminLayout,
  ClientLayout,
  SpecialistLayout,
} from './components/layouts'
import { AuthProvider, ProtectedRoute } from './components/auth'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route index element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminHome />} />
            <Route path="specialties" element={<Specialties />} />
            <Route path="specialists" element={<Specialists />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['ESPECIALISTA']} />}>
          <Route path="/specialist" element={<SpecialistLayout />}>
            <Route index element={<SpecialistHome />} />
            <Route path="availability" element={<Availability />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['CLIENTE']} />}>
          <Route path="/client" element={<ClientLayout />}>
            <Route index element={<ClientHome />} />
            <Route path="appointments" element={<ClientAppointments />} />
            <Route
              path="schedule-appointment"
              element={<ScheduleAppointment />}
            />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  )
}

export default App
