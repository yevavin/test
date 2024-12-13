import { ref } from 'vue'

export function useTooltip() {
  const isVisible = ref(false)
  const tooltipId = ref(`tooltip-${Math.random().toString(36).slice(2)}`)
  const triggerRef = ref<HTMLButtonElement | null>(null)
  const contentRef = ref<HTMLDivElement | null>(null)
  const containerRef = ref<HTMLDivElement | null>(null)

  const showTooltip = () => {
    isVisible.value = true
  }

  const hideTooltip = () => {
    isVisible.value = false
  }

  const handleMouseEnter = () => {
    showTooltip()
  }

  const handleMouseLeave = (event: MouseEvent) => {
    const target = event.relatedTarget as HTMLElement
    // Check if we're moving within the tooltip container
    if (containerRef.value?.contains(target)) {
      return
    }
    hideTooltip()
  }

  const handleEscape = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && isVisible.value) {
      hideTooltip()
      triggerRef.value?.focus()
    }
  }

  return {
    isVisible,
    tooltipId,
    triggerRef,
    contentRef,
    containerRef,
    showTooltip,
    hideTooltip,
    handleMouseEnter,
    handleMouseLeave,
    handleEscape
  }
}