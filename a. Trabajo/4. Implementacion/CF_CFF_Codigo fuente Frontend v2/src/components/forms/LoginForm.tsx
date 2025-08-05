import { Field, Form, Formik, type FormikHelpers } from 'formik'
import Logo from '../../assets/images/logo.png'
import { useState } from 'react'
import { Link } from 'react-router'
import { IconFactory } from '../factory/IconFactory'

export interface FormValues {
  email: string
  password: string
}

const initialValues: FormValues = {
  email: '',
  password: '',
}

interface Props {
  onSubmit?: (values: FormValues) => void | Promise<void>
  onError?: () => void
}

export function LoginForm({ onSubmit, onError }: Props) {
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (
    values: FormValues,
    { setSubmitting, resetForm }: FormikHelpers<FormValues>
  ) => {
    try {
      setError(null)
      await onSubmit?.(values)
      resetForm()
    } catch {
      setError('Email o contraseña incorrectos')
      onError?.()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      {({ isSubmitting }) => (
        <Form className="bg-white w-fit rounded-md p-6 flex gap-y-4 flex-col">
          <div className="flex flex-col gap-y-2">
            <img
              className="max-w-[120px] mx-auto"
              src={Logo}
              alt="Logotipo de la Fundación Carlitos"
            />
            <p className="text-center text-2xl font-semibold m-0">
              Bienvenido de nuevo
            </p>
            <p className="text-center m-0">
              Ingresa tus credenciales para acceder al sistema
            </p>
          </div>
          <div className="inline-flex flex-col gap-y-2">
            <label htmlFor="email">Correo electrónico</label>
            <Field
              className="border-gray-300 border rounded-md p-2"
              id="email"
              name="email"
              type="email"
              required
            />
          </div>
          <div className="inline-flex flex-col gap-y-2">
            <label htmlFor="password">Contraseña</label>
            <Field
              className="border-gray-300 border rounded-md p-2"
              id="password"
              name="password"
              type="password"
              required
            />
          </div>
          {error && <p className="text-red-500 text-center">{error}</p>}
          <button
            className="py-3 text-center text-white bg-blue-500 rounded-md"
            type="submit"
            disabled={isSubmitting}
          >
            <span className="inline-flex gap-x-2 items-center">
              {isSubmitting && (
                <IconFactory
                  name="loading"
                  color="white"
                  className="animate-spin"
                />
              )}
              {isSubmitting ? 'Verificando' : 'Iniciar Sesión'}
            </span>
          </button>
          <p className="text-center">
            ¿No tienes cuenta?{' '}
            <Link className="text-blue-500" to="/register">
              Regístrate aquí
            </Link>
          </p>
        </Form>
      )}
    </Formik>
  )
}
