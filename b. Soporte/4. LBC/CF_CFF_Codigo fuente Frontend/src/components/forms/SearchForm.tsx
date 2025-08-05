import { Field, Form, Formik } from 'formik'
import { IconFactory } from '../factory/IconFactory'

interface Props {
  id?: string
  name?: string
  placeholder?: string
  onSubmit?: (query: string) => void | Promise<void>
  onReset?: () => void
}

interface FormValues {
  search: string
}

const initialValues: FormValues = {
  search: '',
}

export function SearchForm({
  id = 'search',
  name = 'search',
  placeholder = '',
  onSubmit,
  onReset,
}: Props) {
  const handleSubmit = (values: FormValues) => {
    onSubmit?.(values.search)
  }

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      <Form className="flex gap-x-2 items-center">
        <label htmlFor="search">Buscar</label>
        <span className="relative">
          <Field
            className="border-gray-300 border rounded-md p-2"
            id={id}
            name={name}
            type="search"
            placeholder={placeholder}
          />
          <button
            className="absolute right-0 top-0 h-full flex items-center p-2"
            type="reset"
            onClick={onReset}
          >
            <IconFactory name="close" />
          </button>
        </span>
      </Form>
    </Formik>
  )
}
