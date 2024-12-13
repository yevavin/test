<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'
import { useTooltip } from './useTooltip'
import TooltipTrigger from './TooltipTrigger.vue'
import TooltipContent from './TooltipContent.vue'

const props = defineProps<{
  text: string
  labelledBy: string
}>()

const {
  isVisible,
  tooltipId,
  triggerRef,
  contentRef,
  containerRef,
  handleMouseEnter,
  handleMouseLeave,
  handleEscape
} = useTooltip()

onMounted(() => {
  document.addEventListener('keydown', handleEscape)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleEscape)
})
</script>

<template>
  <div 
    ref="containerRef"
    class="tooltip-container"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <TooltipTrigger
      ref="triggerRef"
      :tooltip-id="tooltipId"
      :is-visible="isVisible"
      :labelled-by="labelledBy"
    />
    <Transition name="tooltip">
      <TooltipContent
        v-if="isVisible"
        ref="contentRef"
        :id="tooltipId"
        :text="text"
      />
    </Transition>
  </div>
</template>

<style scoped>
.tooltip-container {
  position: relative;
  display: inline-block;
}

.tooltip-enter-active,
.tooltip-leave-active {
  transition: opacity 0.2s ease;
}

.tooltip-enter-from,
.tooltip-leave-to {
  opacity: 0;
}
</style>