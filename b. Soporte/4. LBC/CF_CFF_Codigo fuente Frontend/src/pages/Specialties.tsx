import { SpecialtiesTable } from '../components/tables/SpecialtiesTable'
import { SearchForm } from '../components/forms/SearchForm'
import {
  type SpecialtyModalData,
  SpecialtyModal,
} from '../components/modals/SpecialtyModal'
import { useMemo, useState } from 'react'
import type { Specialty } from '../types/specialty'
import { MessageModal } from '../components/modals/MessageModal'
import { useSpecialties } from '../hooks/useSpecialties'
import type { FormValues } from '../components/forms/SpecialtyForm'
import { mapToCreateSpecialty, mapToUpdateSpecialty } from '../utils/specialty'
import { useMessageModal } from '../hooks/useMessageModal'
import { useSearch } from '../hooks/useSearch'

export function Specialties() {
  const {
    specialties,
    loading,
    createSpecialty,
    updateSpecialty,
    deleteSpecialty,
  } = useSpecialties()

  const [specialtyModal, setSpecialtyModal] = useState<SpecialtyModalData>({
    initialValues: undefined,
    mode: 'add',
    open: false,
  })

  const { modal, openModal, closeModal } = useMessageModal({
    title: 'Especialidad',
  })

  const closeAndResetModal = () => closeModal({ reset: true })

  const filterByName = (specialty: Specialty, query: string) => {
    return specialty.name
      .toLocaleLowerCase()
      .includes(query.trim().toLocaleLowerCase())
  }

  const [filteredSpecialties, { search, reset }] = useSearch(specialties, {
    filterBy: filterByName,
  })

  const openSpecialtyModal = (
    mode: SpecialtyModalData['mode'],
    specialty?: Specialty
  ) => {
    setSpecialtyModal({
      mode,
      initialValues: specialty,
      open: true,
    })
  }

  const closeSpecialtyModal = () => {
    setSpecialtyModal((modal) => ({
      ...modal,
      open: false,
    }))
  }

  const addSpecialty = async (form: FormValues) => {
    const specialty = mapToCreateSpecialty(form)
    await createSpecialty(specialty)
    closeSpecialtyModal()
  }

  const modifySpecialty = async (form: FormValues) => {
    const id = form.id

    if (!id)
      throw new Error(
        'No se ha proporcionado un ID de especialidad para actualizar'
      )

    const specialty = mapToUpdateSpecialty(form)
    await updateSpecialty(id, specialty)

    closeSpecialtyModal()
  }

  const removeSpecialty = async (id: string) => {
    try {
      await deleteSpecialty(id)
      closeModal()
    } catch {
      showError('delete')
    }
  }

  const handleSubmit = async (
    form: FormValues,
    mode: SpecialtyModalData['mode']
  ) => {
    switch (mode) {
      case 'add':
        await addSpecialty(form)
        break

      case 'edit':
        await modifySpecialty(form)
        break
    }
  }

  const showError = async (
    mode: NonNullable<SpecialtyModalData['mode']> | 'delete'
  ) => {
    const messages: Record<typeof mode, string> = {
      add: 'La especialidad no pudo ser creada, intentelo más tarde',
      edit: 'La especialidad no se pudo modificar, intentelo más tarde',
      delete: 'La especialidad no pudo ser eliminada, intentelo más tarde',
    }

    openModal({
      message: messages[mode],
      icon: 'error',
    })
  }

  const handleDelete = async (specialty: Specialty) => {
    openModal({
      message: `¿Estas seguro que deseas eliminar la especialidad de "${specialty.name}"?`,
      icon: 'danger',
      buttons: [
        {
          label: 'Eliminar',
          style: 'error',
          onClick: () => removeSpecialty(specialty.id),
        },
        {
          label: 'Cancelar',
          onClick: closeAndResetModal,
        },
      ],
    })
  }

  const specialtiesToShow = useMemo(() => {
    return filteredSpecialties.length < specialties.length
      ? filteredSpecialties
      : specialties
  }, [filteredSpecialties, specialties])

  return (
    <main className="p-8">
      <h1 className="text-4xl font-semibold">Gestionar Especialidades</h1>
      <div className="flex justify-between items-center py-8">
        <SearchForm
          placeholder="Oftalmología"
          onSubmit={search}
          onReset={reset}
        />
        <button
          className="bg-blue-500 text-white p-2 rounded-md h-fit"
          type="button"
          onClick={() => openSpecialtyModal('add')}
        >
          Agregar Especialidad
        </button>
      </div>
      <SpecialtiesTable
        specialties={specialtiesToShow}
        loading={loading}
        onEdit={(specialty) => openSpecialtyModal('edit', specialty)}
        onDelete={handleDelete}
      />
      <SpecialtyModal
        open={specialtyModal.open}
        initialValues={specialtyModal.initialValues}
        mode={specialtyModal.mode}
        onClose={closeSpecialtyModal}
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
