import { useState } from 'react'
import type { ModalButtonProps } from '../components/modals/ModalButton'
import type { ModalIconType } from '../components/modals/ModalIcon'

interface MessageModalState {
  open: boolean
  title: string
  message: string
  icon: ModalIconType
  buttons?: ModalButtonProps[]
}

export function useMessageModal(initialState?: Partial<MessageModalState>) {
  const defaultState = (): MessageModalState => ({
    open: initialState?.open ?? false,
    title: initialState?.title ?? '',
    message: initialState?.message ?? '',
    icon: initialState?.icon ?? 'info',
    buttons: initialState?.buttons,
  })

  const [modalState, setModalState] = useState<MessageModalState>(defaultState)

  const resetModal = () => {
    setModalState(defaultState())
  }

  const openModal = (payload: Partial<Omit<MessageModalState, 'open'>>) => {
    setModalState((prev) => ({
      ...prev,
      ...payload,
      open: true,
    }))
  }

  const closeModal = ({ reset }: { reset?: boolean } = {}) => {
    if (reset) {
      resetModal()
    }

    setModalState((prev) => ({ ...prev, open: false }))
  }

  const modal = {
    open: modalState.open,
    data: {
      title: modalState.title,
      message: modalState.message,
      icon: modalState.icon,
    },
    buttons: modalState.buttons,
  }

  return {
    modal,
    openModal,
    closeModal,
  }
}
