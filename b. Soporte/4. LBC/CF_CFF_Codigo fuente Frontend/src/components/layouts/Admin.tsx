import { SidebarLayout, type SidebarOption } from './Sidebar'
import { Outlet } from 'react-router'
import { IconFactory } from '../factory/IconFactory'

export function AdminLayout() {
  const navOptions: SidebarOption[] = [
    {
      icon: <IconFactory name="estethoscope" className="w-[14px] h-[14px]" />,
      label: 'Gestionar Especialidades',
      path: '/admin/specialties',
    },
    {
      icon: <IconFactory name="doctor" className="w-[14px] h-[14px]" />,
      label: 'Gestionar Especialistas',
      path: '/admin/specialists',
    },
  ]

  return (
    <SidebarLayout options={navOptions}>
      <Outlet />
    </SidebarLayout>
  )
}
