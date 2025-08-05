import { useState } from 'react'
import { Modal } from './Modal'
import {
  SpecialistForm,
  type FormData,
  type FormValues,
} from '../forms/SpecialistForm'
import { IconFactory } from '../factory/IconFactory'

export interface SpecialistModalData extends FormData {
  open?: boolean
}

interface Props extends SpecialistModalData {
  onSubmit?: (
    specialist: FormValues,
    mode: SpecialistModalData['mode']
  ) => void | Promise<void>
  onError?: (mode: NonNullable<SpecialistModalData['mode']>) => void
  onClose?: () => void
}

export function SpecialistModal({
  open = false,
  mode = 'add',
  initialValues,
  onSubmit,
  onError,
  onClose,
}: Props) {
  const [isSubmitting, setSubmitting] = useState(false)

  const handleSubmit = async (specialist: FormValues) => {
    setSubmitting(true)
    await onSubmit?.(specialist, mode)
    setSubmitting(false)
  }

  const handleError = () => {
    setSubmitting(false)
    onError?.(mode)
  }

  const handleClose = () => {
    if (isSubmitting) return

    onClose?.()
  }

  return (
    <Modal open={open} onClose={handleClose}>
      <aside className="bg-white p-6 rounded-md border border-gray-300 flex flex-col gap-y-4 min-w-[50%] relative">
        <button
          className="absolute right-0 top-0 m-2"
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
        >
          <IconFactory
            name="close"
            className="text-red-500 w-[20px] h-[20px]"
          />
        </button>
        <SpecialistForm
          onSubmit={handleSubmit}
          onError={handleError}
          initialValues={initialValues}
          mode={mode}
        />
      </aside>
    </Modal>
  )
}
