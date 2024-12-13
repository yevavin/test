// Dimensions
export const ITEM_HEIGHT = 36
export const MAX_VISIBLE_ITEMS = 3
export const ICON_SIZES = {
  chevron: 20,
  check: 16
} as const

// Colors
export const COLORS = {
  text: {
    primary: '#1a202c',
  },
  border: {
    default: '#e2e8f0',
    hover: '#cbd5e0',
    focus: '#4299e1',
  },
  background: {
    white: '#fff',
    hover: '#f7fafc',
    selected: '#ebf8ff',
  },
  scrollbar: {
    thumb: '#cbd5e0',
    track: '#f7fafc',
  },
  icon: {
    check: '#4299e1',
  },
} as const

// Sizes
export const SIZES = {
  maxWidth: '300px',
  borderRadius: '6px',
  fontSize: {
    label: '24px',
    control: '14px',
  },
  padding: {
    control: '8px 16px',
    optionItem: '8px 16px',
  },
  gap: '8px',
  scrollbarWidth: '8px',
} as const

// Shadow
export const SHADOW = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'

// Focus ring
export const FOCUS_RING = '0 0 0 3px rgba(66, 153, 225, 0.15)'