import { ErrorMessage, Field, Form, Formik, type FormikHelpers } from 'formik'
import { useSpecialties } from '../../hooks/useSpecialties'
import * as Yup from 'yup'
import { isValidFullName, isValidPhoneNumber } from '../../utils/validation'
import { IconFactory } from '../factory/IconFactory'

type FormMode = 'add' | 'edit'

export interface FormValues {
  id?: string
  fullName: string
  email: string
  phoneNumber: string
  title: string
  specialtyId: string
  isActive: boolean
}

export interface FormData {
  initialValues?: FormValues
  mode?: FormMode
}

interface Props extends FormData {
  onSubmit?: (specialist: FormValues) => void | Promise<void>
  onError?: () => void
}

const defaultValues: FormValues = {
  fullName: '',
  email: '',
  phoneNumber: '',
  title: '',
  specialtyId: '',
  isActive: true,
}

const validationSchema = Yup.object({
  fullName: Yup.string()
    .required('Este campo es obligatorio')
    .max(30, 'El nombre es muy largo, ingrese solo nombre y apellido')
    .test(
      'test-full-name',
      'Ingrese nombre y apellido: John Doe',
      isValidFullName
    ),
  email: Yup.string()
    .email('Ingrese un correo electrónico válido')
    .required('Este campo es obligatorio'),
  phoneNumber: Yup.string()
    .required('Este campo es obligatorio')
    .test(
      'test-phone-number',
      'Ingrese un numero de telefono válido',
      isValidPhoneNumber
    ),
  title: Yup.string()
    .min(3, 'El texto es muy corto')
    .max(50, 'El texto es muy largo')
    .required('Este campo es obligatorio'),
  specialtyId: Yup.string().required('Este campo es obligatorio'),
  isActive: Yup.boolean().required(),
})

export function SpecialistForm({
  initialValues,
  mode = 'add',
  onSubmit,
  onError,
}: Props) {
  const { specialties } = useSpecialties({ includeInactive: false })

  const isEditMode = mode === 'edit'
  const title = isEditMode ? 'Editar' : 'Agregar'

  const handleSubmit = async (
    values: FormValues,
    { setSubmitting, resetForm }: FormikHelpers<FormValues>
  ) => {
    try {
      await onSubmit?.(values)

      if (!isEditMode) {
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
          <p className="text-center text-2xl font-semibold m-0">{`${title} especialista`}</p>
          <div className="inline-flex flex-col gap-y-2">
            <label className="flex items-start" htmlFor="fullName">
              Nombre completo<span className="text-red-500 text-sm">*</span>
            </label>
            <Field
              className="border-gray-300 border rounded-md p-2"
              id="fullName"
              name="fullName"
              placeholder="John Doe"
            />
            <ErrorMessage
              className="text-red-500 text-sm"
              component="span"
              name="fullName"
            />
          </div>
          <div className="inline-flex flex-col gap-y-2">
            <label className="flex items-start" htmlFor="email">
              Correo electronico<span className="text-red-500 text-sm">*</span>
            </label>
            <Field
              className="border-gray-300 border rounded-md p-2"
              id="email"
              name="email"
              type="email"
              placeholder="johndoe@email.com"
              readOnly={isEditMode}
            />
            <ErrorMessage
              className="text-red-500 text-sm"
              component="span"
              name="email"
            />
          </div>
          <div className="inline-flex flex-col gap-y-2">
            <label className="flex items-start" htmlFor="phoneNumber">
              Telefono<span className="text-red-500 text-sm">*</span>
            </label>
            <Field
              className="border-gray-300 border rounded-md p-2"
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              placeholder="0985369201"
            />
            <ErrorMessage
              className="text-red-500 text-sm"
              component="span"
              name="phoneNumber"
            />
          </div>
          <div className="inline-flex flex-col gap-y-2">
            <label className="flex items-start" htmlFor="title">
              Titulo<span className="text-red-500 text-sm">*</span>
            </label>
            <Field
              className="border-gray-300 border rounded-md p-2"
              id="title"
              name="title"
              placeholder="Psicologo"
            />
            <ErrorMessage
              className="text-red-500 text-sm"
              component="span"
              name="title"
            />
          </div>
          <div className="inline-flex flex-col gap-y-2">
            <label className="flex items-start" htmlFor="specialtyId">
              Especialidad<span className="text-red-500 text-sm">*</span>
            </label>
            <Field
              className="border-gray-300 border rounded-md p-2"
              id="specialtyId"
              name="specialtyId"
              as="select"
            >
              <option value={''}>Seleccionar especialidad</option>
              {specialties.map((specialist) => (
                <option key={specialist.id} value={specialist.id}>
                  {specialist.name}
                </option>
              ))}
            </Field>
            <ErrorMessage
              className="text-red-500 text-sm"
              component="span"
              name="specialtyId"
            />
          </div>
          {isEditMode && (
            <div className="inline-flex gap-y-2">
              <div className="inline-flex gap-x-4 items-center">
                <label className="flex items-start" htmlFor="isActive">
                  Activo
                </label>
                <Field
                  className="border-gray-300 border rounded-md p-2"
                  id="isActive"
                  name="isActive"
                  type="checkbox"
                />
              </div>
              <ErrorMessage
                className="text-red-500 text-sm"
                component="span"
                name="isActive"
              />
            </div>
          )}
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
