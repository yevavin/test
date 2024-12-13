import { Ref } from 'vue'
import type { Option } from './types'

interface UseKeyboardProps {
  isOpen: Ref<boolean>
  activeIndex: Ref<number>
  options: Option[]
  onSelect: (option: Option) => void
  onActiveIndexChange?: () => void
}

export function useKeyboard({ isOpen, activeIndex, options, onSelect, onActiveIndexChange }: UseKeyboardProps) {
  const handleKeyDown = (event: KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        if (!isOpen.value) {
          isOpen.value = true
        } else {
          activeIndex.value = (activeIndex.value + 1) % options.length
          onActiveIndexChange?.()
        }
        break

      case 'ArrowUp':
        event.preventDefault()
        if (!isOpen.value) {
          isOpen.value = true
        } else {
          activeIndex.value = activeIndex.value <= 0 ? options.length - 1 : activeIndex.value - 1
          onActiveIndexChange?.()
        }
        break

      case 'Enter':
        event.preventDefault()
        if (isOpen.value && activeIndex.value >= 0) {
          onSelect(options[activeIndex.value])
        } else {
          isOpen.value = true
        }
        break

      case 'Escape':
        event.preventDefault()
        isOpen.value = false
        break

      case ' ':
        event.preventDefault()
        if (!isOpen.value) {
          isOpen.value = true
        }
        break
    }
  }

  return {
    handleKeyDown
  }
}