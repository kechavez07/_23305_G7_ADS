import { SidebarLayout, type SidebarOption } from './Sidebar'
import { Outlet } from 'react-router'
import { IconFactory } from '../factory/IconFactory'

export function SpecialistLayout() {
  const navOptions: SidebarOption[] = [
    {
      icon: <IconFactory name="schedule" className="w-[14px] h-[14px]" />,
      label: 'Gestionar Disponibilidad',
      path: '/specialist/availability',
    },
  ]

  return (
    <SidebarLayout options={navOptions}>
      <Outlet />
    </SidebarLayout>
  )
}
