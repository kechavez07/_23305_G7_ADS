import { useEffect, useState } from 'react'

interface Value<K> {
  id: K
}

interface Args<K, V> {
  initialIds?: K[]
  getValueAsync: (id: K) => Promise<V>
}

export function useDataCache<K extends string | number, V extends Value<K>>({
  initialIds,
  getValueAsync,
}: Args<K, V>) {
  const [data, setData] = useState<Record<K, V>>({} as Record<K, V>)

  const loadValue = async (id: K) => {
    const valueCached = data[id]

    if (valueCached) {
      return valueCached
    }

    const newValue = await getValueAsync(id)

    setData((prev) => ({ ...prev, [id]: newValue }))

    return newValue
  }

  const getValues = () => {
    return Object.values(data)
  }

  const getValue = (id: K): V | null => {
    return data[id] ?? null
  }

  useEffect(() => {
    if (!initialIds?.length) return

    const idsToLoad = initialIds.filter((id) => !data[id])

    if (!idsToLoad.length) return

    Promise.all(idsToLoad.map(getValueAsync)).then((specialtiesFetched) => {
      setData((prev) => {
        const newMap = { ...prev }
        for (const value of specialtiesFetched) {
          newMap[value.id] = value
        }
        return newMap
      })
    })
  }, [initialIds, data, getValueAsync])

  return {
    getValues,
    loadValue,
    getValue,
  }
}
