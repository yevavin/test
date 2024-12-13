import type { Option, SourceOption } from './types'

export const mapSourceOption = (source: SourceOption): Option => ({
  value: source.kod,
  label: source.namn
})