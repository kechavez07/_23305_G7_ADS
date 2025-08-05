import { LoginForm, type FormValues } from '../components/forms/LoginForm'
import { mapToLogin } from '../utils/auth'
import { useAuth } from '../hooks/useAuth'

export function Login() {
  const { login } = useAuth()

  const handleSubmit = async (values: FormValues) => {
    const loginData = mapToLogin(values)
    await login(loginData)
  }

  return (
    <main className="bg-slate-300 h-dvh flex justify-center items-center">
      <LoginForm onSubmit={handleSubmit} />
    </main>
  )
}
