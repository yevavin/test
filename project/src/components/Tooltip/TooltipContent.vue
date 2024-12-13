<script setup lang="ts">
defineProps<{
  id: string
  text: string
}>()
</script>

<template>
  <div 
    :id="id"
    class="tooltip-content"
    role="tooltip"
  >
    {{ text }}
  </div>
</template>

<style scoped>
.tooltip-content {
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  padding: 8px 12px;
  background: #1a202c;
  color: white;
  font-size: 12px;
  border-radius: 4px;
  white-space: nowrap;
  z-index: 20;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  pointer-events: auto;
}

.tooltip-content::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border-width: 4px;
  border-style: solid;
  border-color: #1a202c transparent transparent transparent;
}
</style>