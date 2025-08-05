import { useMemo, useState } from 'react'
import { MessageModal } from '../components/modals/MessageModal'
import {
  SpecialistModal,
  type SpecialistModalData,
} from '../components/modals/SpecialistModal'
import { SpecialistsTable } from '../components/tables/SpecialistsTable'
import { useMessageModal } from '../hooks/useMessageModal'
import { useSpecialists } from '../hooks/useSpecialists'
import type { Specialist } from '../types/specialist'
import type { FormValues } from '../components/forms/SpecialistForm'
import {
  mapToCreateSpecialist,
  mapToUpdateSpecialist,
} from '../utils/specialist'
import { SearchForm } from '../components/forms/SearchForm'
import { useSearch } from '../hooks/useSearch'

export function Specialists() {
  const {
    specialists,
    loading,
    createSpecialist,
    updateSpecialist,
    deleteSpecialist,
  } = useSpecialists()

  const { modal, openModal, closeModal } = useMessageModal({
    title: 'Especialista',
  })

  const closeAndResetModal = () => closeModal({ reset: true })

  const [specialistModal, setSpecialistModal] = useState<SpecialistModalData>({
    initialValues: undefined,
    open: false,
  })

  const filterByName = (specialist: Specialist, query: string) => {
    return specialist.fullName
      .toLocaleLowerCase()
      .includes(query.trim().toLocaleLowerCase())
  }

  const [filteredSpecialists, { reset, search }] = useSearch(specialists, {
    filterBy: filterByName,
  })

  const openSpecialistModal = (
    mode: SpecialistModalData['mode'],
    specialist?: Specialist
  ) => {
    setSpecialistModal({
      mode,
      initialValues: specialist,
      open: true,
    })
  }

  const closeSpecialistModal = () => {
    setSpecialistModal((modal) => ({
      ...modal,
      open: false,
    }))
  }

  const addSpecialist = async (form: FormValues) => {
    const specialist = mapToCreateSpecialist(form)
    await createSpecialist(specialist)
  }

  const modifySpecialist = async (form: FormValues) => {
    const id = form.id

    if (!id)
      throw new Error(
        'No se ha proporcionado un ID de especialidad para actualizar'
      )

    const specialist = mapToUpdateSpecialist(form)
    await updateSpecialist(id, specialist)
  }

  const removeSpecialist = async (id: string) => {
    try {
      await deleteSpecialist(id)
      closeModal()
    } catch {
      showError('delete')
    }
  }

  const handleSubmit = async (
    form: FormValues,
    mode: SpecialistModalData['mode']
  ) => {
    try {
      switch (mode) {
        case 'add':
          await addSpecialist(form)
          break

        case 'edit':
          await modifySpecialist(form)
          break
      }

      closeSpecialistModal()

      if (mode) {
        showSuccess(mode)
      }
    } catch (error) {
      console.error(`Error al ${mode} especialista:`, error)

      if (mode) {
        showError(mode)
      }
    }
  }

  const showError = async (
    mode: NonNullable<SpecialistModalData['mode']> | 'delete'
  ) => {
    const messages: Record<typeof mode, string> = {
      add: 'El especialista no pudo ser creado, intentelo más tarde',
      edit: 'El especialista no se pudo modificado, intentelo más tarde',
      delete: 'El especialista no pudo ser eliminado, intentelo más tarde',
    }

    openModal({
      message: messages[mode],
      icon: 'error',
    })
  }

  const showSuccess = (mode: 'add' | 'edit' | 'delete') => {
    const messages: Record<typeof mode, string> = {
      add: '¡Especialista creado con éxito! Se han enviado las credenciales de acceso al correo electrónico proporcionado.',
      edit: 'La información del especialista ha sido actualizada correctamente.',
      delete: 'El especialista ha sido eliminado (desactivado) exitosamente.',
    }

    openModal({
      title: 'Operación Exitosa',
      message: messages[mode],
      icon: 'success',
      buttons: [
        {
          label: 'Aceptar',
          onClick: closeAndResetModal,
        },
      ],
    })
  }

  const handleDelete = async (specialist: Specialist) => {
    openModal({
      message: `¿Estas seguro que deseas eliminar al especialista "${specialist.fullName}"?`,
      icon: 'danger',

      buttons: [
        {
          label: 'Eliminar',
          style: 'error',
          onClick: () => removeSpecialist(specialist.id),
        },
        {
          label: 'Cancelar',
          onClick: closeAndResetModal,
        },
      ],
    })
  }

  const specialistsToShow = useMemo(() => {
    return filteredSpecialists.length < specialists.length
      ? filteredSpecialists
      : specialists
  }, [filteredSpecialists, specialists])

  return (
    <main className="p-8">
      <h1 className="text-4xl font-semibold">Gestionar Especialistas</h1>
      <div className="flex justify-between items-center py-8">
        <SearchForm placeholder="Jane Doe" onSubmit={search} onReset={reset} />
        <button
          className="bg-blue-500 text-white p-2 rounded-md h-fit"
          type="button"
          onClick={() => openSpecialistModal('add')}
        >
          Agregar Especialista
        </button>
      </div>
      <SpecialistsTable
        specialists={specialistsToShow}
        loading={loading}
        onEdit={(specialty) => openSpecialistModal('edit', specialty)}
        onDelete={handleDelete}
      />
      <SpecialistModal
        open={specialistModal.open}
        initialValues={specialistModal.initialValues}
        mode={specialistModal.mode}
        onClose={closeSpecialistModal}
        onSubmit={handleSubmit}
        onError={showError}
      />
      <MessageModal
        open={modal.open}
        data={modal.data}
        buttons={modal.buttons}
        onClose={closeAndResetModal}
      />
    </main>
  )
}
