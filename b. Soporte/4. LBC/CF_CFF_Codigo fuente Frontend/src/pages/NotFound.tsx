import { Link } from 'react-router'
import { ROLE_HOME_PATHS } from '../constants/routes'
import { useAuth } from '../hooks/useAuth'

export function NotFound() {
  const { authUser } = useAuth()

  const redirectTo = !authUser ? '/' : ROLE_HOME_PATHS[authUser.role]

  return (
    <main className="h-dvh flex flex-col gap-y-4 justify-center items-center">
      <h1 className="text-4xl font-semibold">Página no encontrada :c</h1>
      <p className="text-2xl">La página a la que tratas de acceder no existe</p>
      <Link className="rounded-md bg-slate-700 text-white p-3" to={redirectTo}>
        Regresar
      </Link>
    </main>
  )
}
