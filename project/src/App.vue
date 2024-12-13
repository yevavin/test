<script setup lang="ts">
import { ref } from 'vue'
import DropdownSelect from './components/DropdownSelect/DropdownSelect.vue'
import { time } from './constants/dropdownOptions'

const selectedValue = ref('OP_SENASTE_30_DAGARNA')
</script>

<template>
  <div class="container">
    <DropdownSelect
      v-model="selectedValue"
      :options="time"
      label="Åtgärder utförda"
      tooltip="Select a time period to filter the actions"
    />
    <p>Selected value: {{ selectedValue }}</p>
  </div>
</template>

<style>
.container {
  max-width: 600px;
  margin: 40px auto;
  padding: 20px;
}
</style>