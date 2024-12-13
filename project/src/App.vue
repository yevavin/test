<script setup lang="ts">
import { ref } from 'vue'
import DropdownSelect from './components/DropdownSelect/DropdownSelect.vue'
import { time } from './constants/dropdownOptions'

const selectedValue = ref('OP_SENASTE_30_DAGARNA')
</script>

<template>
  <div class="container">
    <DropdownSelect
            :default-value="'OP_SENASTE_90_DAGARNA'"
            :options="TIDSPERIODER"
            :label="$t('lagesbildView.lagesbildComponent.search.tidsperiodLabel')"
            @update:modelValue="fetchLagesbild()"
          >
            <template #labelAfter="{ labelledBy }">
              <Tooltip
                :labelled-by="labelledBy"
                :text="$t('lagesbildView.lagesbildComponent.search.tidsperiodTooltip')"
              ></Tooltip>
            </template>
    </DropdownSelect>
  </div>
</template>

<style>
.container {
  max-width: 600px;
  margin: 40px auto;
  padding: 20px;
}
</style>
