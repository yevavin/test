<script setup lang="ts">
import TooltipIcon from './TooltipIcon.vue'

defineProps<{
  tooltipId: string
  isVisible: boolean
  labelledBy: string
}>()
</script>

<template>
  <button 
    type="button" 
    class="tooltip-trigger"
    :aria-describedby="tooltipId"
    :aria-expanded="isVisible"
    :aria-labelledby="labelledBy"
  >
    <span class="sr-only">More information about {{ labelledBy }}</span>
    <TooltipIcon />
  </button>
</template>

<style scoped>
.tooltip-trigger {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  background: transparent;
  border: none;
  color: #718096;
  cursor: help;
  transition: color 0.2s;
}

.tooltip-trigger:hover,
.tooltip-trigger:focus {
  color: #4a5568;
  outline: none;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>