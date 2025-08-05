import { useState } from 'react'

interface Options<T> {
  filterBy: (value: T, query: string) => boolean
}

type Return<T> = [
  T[],
  {
    query: string
    search: (query: string) => void
    reset: () => void
  },
]

export function useSearch<T>(
  initialData: T[],
  { filterBy }: Options<T>
): Return<T> {
  const [query, setQuery] = useState<string>('')

  const search = (newQuery: string) => {
    setQuery(newQuery)
  }

  const reset = () => {
    setQuery('')
  }

  const filteredData = query
    ? initialData.filter((item) => filterBy(item, query))
    : initialData

  return [filteredData, { query, search, reset }]
}
