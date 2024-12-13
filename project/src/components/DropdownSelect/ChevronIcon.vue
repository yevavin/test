<script setup lang="ts">
const ICON_SIZE = 20
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
    class="chevron-icon"
  >
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
</template>

<style scoped>
.chevron-icon {
  transition: transform 0.2s ease;
}
</style>