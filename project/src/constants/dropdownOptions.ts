export const time = [
  { kod: 'OP_SENASTE_30_DAGARNA', namn: 'Senaste månaden' },
  { kod: 'OP_SENASTE_90_DAGARNA', namn: 'Senaste 3 månaderna' },
  { kod: 'OP_SENASTE_365_DAGARNA', namn: 'Senaste året' },
  { kod: 'OP_ALLA_TIDER', namn: 'Alla tider' }
] as const

export type TimeOption = typeof time[number]