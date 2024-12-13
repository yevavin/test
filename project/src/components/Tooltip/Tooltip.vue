<template>
  <div ref="containerRef" class="tooltip">
    <button
      ref="triggerRef"
      type="button"
      class="tooltip__trigger"
      :aria-describedby="tooltipId"
      :aria-expanded="isVisible"
      :aria-labelledby="labelledBy"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
      @focus="handleFocus"
      @blur="handleBlur"
      @keydown.enter.prevent="showTooltip"
      @keydown.space.prevent="showTooltip"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
        <line x1="12" y1="17" x2="12.01" y2="17"></line>
      </svg>
    </button>
    <Transition name="tooltip">
      <div
        class="tooltip__wrapper"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave"
        v-if="isVisible"
        :id="tooltipId"
        role="tooltip"
      >
        <div class="tooltip__content">
          {{ text }}
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps<{
  text: string
  labelledBy: string
}>()

const tooltipId = `tooltip-${Math.random().toString(36).slice(2)}`

const isVisible = ref(false)
const triggerRef = ref<HTMLButtonElement | null>(null)
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
  // Only hide if moving outside the entire tooltip container
  if (!containerRef.value?.contains(target)) {
    hideTooltip()
  }
}

const handleKeyboardInteraction = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && isVisible.value) {
    hideTooltip()
    triggerRef.value?.focus()
  }
}

const handleFocus = () => {
  showTooltip()
}

const handleBlur = () => {
  hideTooltip()
}

onMounted(() => {
  document.addEventListener('keydown', handleKeyboardInteraction)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeyboardInteraction)
})
</script>

<style lang="scss" scoped>
.tooltip {
  position: relative;
  display: inline-block;
}

.tooltip {
  &__trigger {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    padding: 0;
    background: transparent;
    border: none;
    color: #98a2b3;
    cursor: pointer;
    transition: color 0.2s;

    &:hover {
      color: #667085;
      outline: none;
    }

    &:focus {
      color: #667085;
      border: 2px solid #101828;
      outline: none;
    }
  }

  &__wrapper {
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-20%);
    width: 200px;
    z-index: 20;
    padding-bottom: 8px;
  }

  &__content {
    background: #101828;
    color: #fff;
    font-size: 12px;
    border-radius: 8px;
    padding: 8px 12px;
    white-space: break-spaces;
    box-shadow:
      0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -1px rgba(0, 0, 0, 0.06);
    position: relative;

    &::after {
      content: '';
      position: absolute;
      top: 100%;
      left: 20%;
      transform: translateX(-50%);
      border-width: 4px;
      border-style: solid;
      border-color: #1a202c transparent transparent transparent;
    }
  }

  &-enter-active,
  &-leave-active {
    transition: opacity 0.2s ease;
  }

  &-enter-from,
  &-leave-to {
    opacity: 0;
  }
}
</style>
