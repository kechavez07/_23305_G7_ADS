import type { SEX_VALUES } from '../constants/sex'

export type Sex = (typeof SEX_VALUES)[number]

export interface SexOption {
  value: Sex
  label: string
}
