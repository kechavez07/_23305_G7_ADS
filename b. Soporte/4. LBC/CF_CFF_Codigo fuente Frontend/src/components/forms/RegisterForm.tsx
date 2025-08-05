import { ErrorMessage, Field, Form, Formik, type FormikHelpers } from 'formik'
import { getSexOptions } from '../../utils/sex'
import * as Yup from 'yup'
import {
  isValidFullName,
  isValidPhoneNumber,
  isAgeInRange,
  MAX_AGE,
  MIN_AGE,
} from '../../utils/validation'
import { Link } from 'react-router'
import type { Sex } from '../../types/sex'
import { IconFactory } from '../factory/IconFactory'

export interface FormValues {
  representativeName: string
  representativeEmail: string
  representativePhone: string
  patientName: string
  patientAge: number
  patientSex: Sex
  medicalCondition: string
}

const initialValues: FormValues = {
  representativeName: '',
  representativeEmail: '',
  representativePhone: '',
  patientName: '',
  patientAge: MIN_AGE,
  patientSex: 'FEMENINO',
  medicalCondition: '',
}

const validationSchema = Yup.object({
  representativeName: Yup.string()
    .required('Este campo es obligatorio')
    .max(50, 'El nombre es muy largo. Ingrese solo nombre y apellido')
    .test(
      'is-fullname-test',
      'Debe ingresar nombre y apellido',
      isValidFullName
    ),
  representativeEmail: Yup.string()
    .email('Ingrese un correo electronico válido')
    .required('Este campo es obligatorio'),
  representativePhone: Yup.string()
    .required('Este campo es obligatorio')
    .test(
      'is-phoneNumber-test',
      'Formato de teléfono incorrecto (Ejm: 0986237104)',
      isValidPhoneNumber
    ),
  patientName: Yup.string()
    .required('Este campo es obligatorio')
    .max(50, 'El nombre es muy largo. Ingrese solo nombre y apellido')
    .test(
      'is-fullname-test',
      'Debe ingresar nombre y apellido',
      isValidFullName
    ),
  patientAge: Yup.number()
    .required('Este campo es obligatorio')
    .test(
      'is-valid-age-test',
      'La edad ingresada no esta permitida',
      isAgeInRange
    ),
  patientSex: Yup.string()
    .oneOf(
      getSexOptions().map((o) => o.value),
      'Este campo es obligatorio'
    )
    .required('Este campo es obligatorio'),
  medicalCondition: Yup.string()
    .min(3, 'El texto es muy corto')
    .max(50, 'El texto es muy largo'),
})

interface Props {
  onSubmit?: (values: FormValues) => void | Promise<void>
  onError?: () => void
}

export function RegisterForm({ onSubmit, onError }: Props) {
  const handleSubmit = async (
    values: FormValues,
    { setSubmitting, resetForm }: FormikHelpers<FormValues>
  ) => {
    try {
      await onSubmit?.(values)
      resetForm()
    } catch {
      onError?.()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className="bg-white w-fit rounded-md p-6 min-w-[50%] flex gap-y-4 flex-col">
          <p className="text-center text-2xl font-semibold m-0">
            Registro de paciente
          </p>
          <div className="inline-flex flex-col gap-y-2">
            <label className="flex items-start" htmlFor="representativeName">
              Nombre del representante
              <span className="text-red-500 text-sm">*</span>
            </label>
            <Field
              className="border-gray-300 border rounded-md p-2"
              id="representativeName"
              name="representativeName"
              placeholder="John Doe"
            />
            <ErrorMessage
              className="text-red-500 text-sm"
              component="span"
              name="representativeName"
            />
          </div>
          <div className="inline-flex flex-col gap-y-2">
            <label className="flex items-start" htmlFor="representativeEmail">
              Correo electrónico<span className="text-red-500 text-sm">*</span>
            </label>
            <Field
              className="border-gray-300 border rounded-md p-2"
              id="representativeEmail"
              name="representativeEmail"
              type="email"
              placeholder="johndoe@email.com"
            />
            <ErrorMessage
              className="text-red-500 text-sm"
              component="span"
              name="representativeEmail"
            />
          </div>
          <div className="inline-flex flex-col gap-y-2">
            <label className="flex items-start" htmlFor="representativePhone">
              Teléfono<span className="text-red-500 text-sm">*</span>
            </label>
            <Field
              className="border-gray-300 border rounded-md p-2"
              id="representativePhone"
              name="representativePhone"
              type="tel"
              placeholder="0936592719"
            />
            <ErrorMessage
              className="text-red-500 text-sm"
              component="span"
              name="representativePhone"
            />
          </div>
          <div className="inline-flex flex-col gap-y-2">
            <label className="flex items-start" htmlFor="patientName">
              Nombre del paciente<span className="text-red-500 text-sm">*</span>
            </label>
            <Field
              className="border-gray-300 border rounded-md p-2"
              id="patientName"
              name="patientName"
              placeholder="Jane Doe"
            />
            <ErrorMessage
              className="text-red-500 text-sm"
              component="span"
              name="patientName"
            />
          </div>
          <div className="inline-flex flex-col gap-y-2">
            <label className="flex items-start" htmlFor="patientAge">
              Edad del paciente<span className="text-red-500 text-sm">*</span>
            </label>
            <Field
              className="border-gray-300 border rounded-md p-2"
              id="patientAge"
              name="patientAge"
              type="number"
              min={MIN_AGE}
              step="1"
              max={MAX_AGE}
              placeholder="25"
            />
            <ErrorMessage
              className="text-red-500 text-sm"
              component="span"
              name="patientAge"
            />
          </div>
          <div className="inline-flex flex-col gap-y-2">
            <label className="flex items-start" htmlFor="patientSex">
              Sexo del paciente<span className="text-red-500 text-sm">*</span>
            </label>
            <Field
              className="border-gray-300 border rounded-md p-2"
              id="patientSex"
              name="patientSex"
              as="select"
            >
              <option value={''}>Seleccionar</option>
              {getSexOptions().map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Field>
            <ErrorMessage
              className="text-red-500 text-sm"
              component="span"
              name="patientSex"
            />
          </div>
          <div className="inline-flex flex-col gap-y-2">
            <label className="flex items-start" htmlFor="medicalCondition">
              ¿Presenta alguna condición?
            </label>
            <Field
              className="border-gray-300 border rounded-md p-2"
              id="medicalCondition"
              name="medicalCondition"
              placeholder="Sindrome de down"
            />
            <ErrorMessage
              className="text-red-500 text-sm"
              component="span"
              name="medicalCondition"
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
              {isSubmitting ? 'Registrando cuenta' : 'Registrarse'}
            </span>
          </button>
          <p className="text-center">
            ¿Tienes una cuenta?{' '}
            <Link className="text-blue-500" to="/">
              Inicia sesión
            </Link>
          </p>
        </Form>
      )}
    </Formik>
  )
}
