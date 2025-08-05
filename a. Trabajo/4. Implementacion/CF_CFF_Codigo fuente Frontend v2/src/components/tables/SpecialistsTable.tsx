import type { Specialist } from '../../types/specialist'
import { useSpecialtyCache } from '../../hooks/useSpecialtyCache'
import { IconFactory } from '../factory/IconFactory'

const COLUMNS = 6

interface Props {
  specialists?: Specialist[] | null
  loading?: boolean
  onEdit?: (specialist: Specialist) => void | Promise<void>
  onDelete?: (specialist: Specialist) => void | Promise<void>
}

export function SpecialistsTable({
  specialists,
  loading,
  onEdit,
  onDelete,
}: Props) {
  const { getSpecialty } = useSpecialtyCache([
    ...new Set(specialists?.map((s) => s.specialtyId)),
  ])

  return (
    <div className="table-x-scroll">
      <table className="table">
        <thead>
          <tr>
            <th>Nombre completo</th>
            <th>Email</th>
            <th>Titulo</th>
            <th>Especialidad</th>
            <th className="column-center">Activo</th>
            <th className="column-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={COLUMNS}>
                <span className="inline-flex items-center gap-x-2">
                  <IconFactory name="loading" className="animate-spin" />{' '}
                  Cargando
                </span>
              </td>
            </tr>
          ) : specialists?.length ? (
            specialists.map((specialist) => (
              <tr key={specialist.id}>
                <td>{specialist.fullName}</td>
                <td>{specialist.email}</td>
                <td>{specialist.title}</td>
                <td>
                  {getSpecialty(specialist.specialtyId)?.name ?? (
                    <IconFactory
                      name="loading"
                      className="mx-auto animate-spin"
                    />
                  )}
                </td>
                <td className="column-center">
                  {specialist.isActive ? (
                    <IconFactory
                      name="valid"
                      className="text-green-500 inline"
                    />
                  ) : (
                    <IconFactory
                      name="invalid"
                      className="text-red-500 inline"
                    />
                  )}
                </td>
                <td>
                  <div className="flex gap-x-3 items-center justify-center">
                    <button
                      className="p-2 bg-yellow-500 rounded-md"
                      type="button"
                      onClick={() => onEdit?.(specialist)}
                    >
                      <IconFactory
                        name="edit"
                        className="text-white w-[12px] h-[12px]"
                      />
                    </button>
                    <button
                      className="p-2 bg-red-500 rounded-md"
                      type="button"
                      onClick={() => onDelete?.(specialist)}
                      disabled={!specialist.isActive}
                    >
                      <IconFactory
                        name="trash"
                        className="text-white w-[12px] h-[12px]"
                      />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={COLUMNS}>No hay especialistas registrados</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
