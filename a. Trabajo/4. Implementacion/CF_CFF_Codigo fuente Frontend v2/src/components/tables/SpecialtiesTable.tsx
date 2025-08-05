import type { Specialty } from '../../types/specialty'
import { IconFactory } from '../factory/IconFactory'

interface Props {
  specialties?: Specialty[] | null
  loading?: boolean
  onEdit?: (specialty: Specialty) => void | Promise<void>
  onDelete?: (specialty: Specialty) => void | Promise<void>
}

const COLUMNS = 4

export function SpecialtiesTable({
  specialties,
  loading = false,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className="table-x-scroll">
      <table className="table">
        <thead>
          <tr>
            <th>Nombre de la especialidad</th>
            <th>Descripción</th>
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
          ) : specialties?.length ? (
            specialties.map((specialty) => (
              <tr key={specialty.id}>
                <td>{specialty.name}</td>
                <td>{specialty.description}</td>
                <td className="column-center">
                  {specialty.isActive ? (
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
                      onClick={() => onEdit?.(specialty)}
                    >
                      <IconFactory
                        name="edit"
                        className="text-white w-[12px] h-[12px]"
                      />
                    </button>
                    <button
                      className="p-2 bg-red-500 rounded-md"
                      type="button"
                      onClick={() => onDelete?.(specialty)}
                      disabled={!specialty.isActive}
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
              <td colSpan={COLUMNS}>No hay especialidades registradas</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
