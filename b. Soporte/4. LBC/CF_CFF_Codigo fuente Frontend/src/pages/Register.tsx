import { RegisterForm, type FormValues } from '../components/forms/RegisterForm'
import { MessageModal } from '../components/modals/MessageModal'
import { useNavigate } from 'react-router'
import { mapToRegistratePatient } from '../utils/patient'
import { registerPatient } from '../services/patient'
import { useMessageModal } from '../hooks/useMessageModal'
import { useState } from 'react'

export function Register() {
  const navigate = useNavigate()
  const { modal, openModal, closeModal } = useMessageModal({
    title: 'Registrar Paciente',
  })
  const [error, setIsError] = useState(false)

  const handleSubmit = async (values: FormValues) => {
    const registration = mapToRegistratePatient(values)

    await registerPatient(registration)

    setIsError(false)
    openModal({
      icon: 'info',
      message: 'El paciente se registro correctamente',
    })
  }

  const handleError = () => {
    openModal({
      icon: 'error',
      message: 'No se pudo registrar el paciente, intentelo nuevamente',
    })
    setIsError(true)
  }

  const navigateToLogin = () => navigate('/', { replace: true })

  const handleClose = () => {
    if (error) {
      closeModal()
    } else {
      navigateToLogin()
    }
  }

  return (
    <main className="bg-slate-300 min-h-dvh flex justify-center items-center p-10">
      <RegisterForm onSubmit={handleSubmit} onError={handleError} />
      <MessageModal open={modal.open} data={modal.data} onClose={handleClose} />
    </main>
  )
}
