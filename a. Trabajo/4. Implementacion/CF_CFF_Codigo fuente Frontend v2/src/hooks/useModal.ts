import { useState } from 'react'

export interface ModalState {
  open: boolean
}

const defaultState: ModalState = {
  open: false,
}

export function useModal(initalState?: ModalState) {
  const [modal, setModal] = useState(initalState ?? defaultState)

  const openModal = () => setModal({ open: true })

  const closeModal = () => setModal({ open: false })

  const toggleModal = () => setModal(({ open }) => ({ open: !open }))

  return {
    ...modal,
    closeModal,
    openModal,
    toggleModal,
  }
}
