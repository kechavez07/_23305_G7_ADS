import { ErrorMessage, Field, Form, Formik, type FormikHelpers } from 'formik'
import { useMemo } from 'react'
import * as Yup from 'yup'
import { IconFactory } from '../factory/IconFactory'

type FormMode = 'add' | 'edit'

export interface FormValues {
  id?: string
  name: string
  description: string
}

export interface FormData {
  initialValues?: FormValues
  mode?: FormMode
}

interface Props extends FormData {
  onSubmit?: (specialty: FormValues) => void | Promise<void>
  onError?: () => void
}

const defaultValues: FormValues = {
  description: '',
  name: '',
}

const validationSchema = Yup.object({
  description: Yup.string()
    .min(3, 'El texto es muy corto')
    .max(50, 'El texto es muy largo')
    .required('Este campo es obligatorio'),
  name: Yup.string()
    .min(3, 'El nombre es muy corto')
    .max(30, 'El nombre es muy largo')
    .required('Este campo es obligatorio'),
})

export function SpecialtyForm({
  initialValues,
  mode = 'add',
  onSubmit,
  onError,
}: Props) {
  const formTitle = useMemo<string>(() => {
    const entityName = 'Especialidad'
    const modeLabel: Record<FormMode, string> = {
      add: 'Agregar',
      edit: 'Editar',
    }

    return `${modeLabel[mode]} ${entityName}`
  }, [mode])

  const handleSubmit = async (
    values: FormValues,
    { setSubmitting, resetForm }: FormikHelpers<FormValues>
  ) => {
    try {
      await onSubmit?.(values)

      if (mode === 'add') {
        resetForm()
      }
    } catch {
      onError?.()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Formik
      initialValues={initialValues ?? defaultValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className="bg-white rounded-md p-6 w-full flex gap-y-4 flex-col">
          <p className="text-center text-2xl font-semibold m-0">{formTitle}</p>
          <div className="inline-flex flex-col gap-y-2">
            <label className="flex items-start" htmlFor="name">
              Nombre<span className="text-red-500 text-sm">*</span>
            </label>
            <Field
              className="border-gray-300 border rounded-md p-2"
              id="name"
              name="name"
              placeholder="Pediatría"
            />
            <ErrorMessage
              className="text-red-500 text-sm"
              component="span"
              name="name"
            />
          </div>
          <div className="inline-flex flex-col gap-y-2">
            <label className="flex items-start" htmlFor="description">
              Descripción<span className="text-red-500 text-sm">*</span>
            </label>
            <Field
              className="border-gray-300 border rounded-md p-2"
              id="description"
              name="description"
              placeholder="Analiza..."
            />
            <ErrorMessage
              className="text-red-500 text-sm"
              component="span"
              name="description"
            />
          </div>
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
              {isSubmitting ? 'Guardando' : 'Guardar'}
            </span>
          </button>
        </Form>
      )}
    </Formik>
  )
}
