import Logo from '../../assets/images/logo.png'
import { NavLink } from 'react-router'
import { useAuth } from '../../hooks/useAuth'
import { IconFactory } from '../factory/IconFactory'

export interface SidebarOption {
  icon: React.ReactNode
  label: string
  path: string
}

interface Props {
  options: SidebarOption[]
  children: React.ReactNode
}

export function SidebarLayout({ options, children }: Props) {
  const { logout } = useAuth()

  return (
    <div className="min-h-dvh grid grid-cols-[280px_1fr] max-w-full">
      <header className="bg-slate-700 text-white relative">
        <nav className="p-5 sticky top-0 min-h-dvh flex flex-col justify-between">
          <div className="flex flex-col gap-y-8">
            <div className="flex flex-col gap-y-2">
              <img
                className="max-w-[120px] mx-auto bg-white rounded-full p-3"
                src={Logo}
                alt="Logotipo de la Fundación Carlitos"
              />
              <p className="font-semibold text-2xl text-center">
                Fundación Carlitos
              </p>
            </div>
            <ul className="flex flex-col gap-y-2">
              {options.map(({ icon, label, path }) => (
                <li key={path}>
                  <NavLink
                    to={path}
                    className={({ isActive }) =>
                      `rounded-md py-3 px-5 flex items-center gap-x-2 ${
                        isActive
                          ? 'bg-blue-400 hover:cursor-default'
                          : 'hover:bg-gray-500'
                      }`
                    }
                  >
                    {icon}
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
          <button
            className="rounded-md hover:bg-red-500 py-3 px-5 flex items-center gap-x-2"
            type="button"
            onClick={logout}
          >
            <IconFactory name="logout" className="w-[16px] h-[16px]" />
            Cerrar Sesión
          </button>
        </nav>
      </header>
      {children}
    </div>
  )
}
