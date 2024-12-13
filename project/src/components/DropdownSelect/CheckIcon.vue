<script setup lang="ts">
const ICON_SIZE = 16
</script>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="ICON_SIZE"
    :height="ICON_SIZE"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="check-icon"
  >
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
</template>

<style scoped>
.check-icon {
  color: #4299e1;
}
</style>