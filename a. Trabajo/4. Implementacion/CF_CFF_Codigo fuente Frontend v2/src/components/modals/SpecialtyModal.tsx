import { useState } from 'react'
import {
  SpecialtyForm,
  type FormData,
  type FormValues,
} from '../forms/SpecialtyForm'
import { Modal } from './Modal'
import { IconFactory } from '../factory/IconFactory'

export interface SpecialtyModalData extends FormData {
  open?: boolean
}

interface Props extends SpecialtyModalData {
  onSubmit?: (
    specialty: FormValues,
    mode: SpecialtyModalData['mode']
  ) => void | Promise<void>
  onError?: (mode: NonNullable<SpecialtyModalData['mode']>) => void
  onClose?: () => void
}

export function SpecialtyModal({
  open = false,
  mode = 'add',
  initialValues,
  onSubmit,
  onError,
  onClose,
}: Props) {
  const [isSubmitting, setSubmitting] = useState(false)

  const handleSubmit = async (specialty: FormValues) => {
    setSubmitting(true)
    await onSubmit?.(specialty, mode)
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
        <SpecialtyForm
          onSubmit={handleSubmit}
          onError={handleError}
          mode={mode}
          initialValues={initialValues}
        />
      </aside>
    </Modal>
  )
}
