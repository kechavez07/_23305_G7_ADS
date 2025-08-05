import { SidebarLayout, type SidebarOption } from './Sidebar'
import { Outlet } from 'react-router'
import { IconFactory } from '../factory/IconFactory'

export function ClientLayout() {
  const navOptions: SidebarOption[] = [
    {
      icon: <IconFactory name="calendarCheck" className="w-[14px] h-[14px]" />,
      label: 'Agendar cita',
      path: '/client/schedule-appointment',
    },
    {
      icon: <IconFactory name="schedule" className="w-[14px] h-[14px]" />,
      label: 'Mis citas',
      path: '/client/appointments',
    },
  ]

  return (
    <SidebarLayout options={navOptions}>
      <Outlet />
    </SidebarLayout>
  )
}
