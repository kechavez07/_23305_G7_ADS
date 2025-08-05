export type QueryParamsMapper<T> = {
  [K in keyof T]: {
    param: string
    value: T[K]
    parser?: (value: T[K]) => string
  }
}

export function buildApiRequestParams<T>(queryParamsMap: QueryParamsMapper<T>) {
  const params: Record<string, string> = {}

  for (const key in queryParamsMap) {
    const { param, value, parser } =
      queryParamsMap[key as keyof QueryParamsMapper<T>]
    params[param] = parser ? parser(value) : String(value)
  }

  return params
}
