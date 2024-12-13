<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { Option } from './types'
import { useKeyboard } from './useKeyboard'
import ChevronIcon from './ChevronIcon.vue'
import CheckIcon from './CheckIcon.vue'
import Tooltip from '../Tooltip/Tooltip.vue'

const props = withDefaults(defineProps<{
  options: Option[]
  modelValue?: string
  defaultValue?: string
  label?: string
  id?: string
  tooltip?: string
}>(), {
  modelValue: undefined,
  defaultValue: undefined,
  label: undefined,
  tooltip: undefined,
  id: () => `dropdown-${Math.random().toString(36).substr(2, 9)}`
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const isOpen = ref(false)
const listboxRef = ref<HTMLUListElement | null>(null)
const controlRef = ref<HTMLButtonElement | null>(null)
const activeIndex = ref(-1)
const labelId = ref(`dropdown-label-${Math.random().toString(36).slice(2)}`)

onMounted(() => {
  if (!props.modelValue && props.defaultValue) {
    emit('update:modelValue', props.defaultValue)
  }
})

const selectedOption = computed(() => 
  props.options.find(opt => opt.kod === props.modelValue) || 
  props.options.find(opt => opt.kod === props.defaultValue)
)

const displayValue = computed(() => selectedOption.value?.namn || 'Select an option')

const scrollActiveOptionIntoView = () => {
  if (isOpen.value && activeIndex.value >= 0 && listboxRef.value) {
    // If it's the first option, always scroll to the top
    if (activeIndex.value === 0) {
      listboxRef.value.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    // If it's the last option, always scroll to the bottom
    if (activeIndex.value === props.options.length - 1) {
      listboxRef.value.scrollTo({ 
        top: listboxRef.value.scrollHeight,
        behavior: 'smooth'
      })
      return
    }

    const activeOption = listboxRef.value.children[activeIndex.value] as HTMLElement
    if (activeOption) {
      const containerTop = listboxRef.value.scrollTop
      const containerBottom = containerTop + listboxRef.value.clientHeight
      const elementTop = activeOption.offsetTop
      const elementBottom = elementTop + activeOption.offsetHeight

      if (elementTop < containerTop) {
        listboxRef.value.scrollTo({
          top: elementTop,
          behavior: 'smooth'
        })
      } else if (elementBottom > containerBottom) {
        listboxRef.value.scrollTo({
          top: elementBottom - listboxRef.value.clientHeight,
          behavior: 'smooth'
        })
      }
    }
  }
}

const { handleKeyDown } = useKeyboard({
  isOpen,
  activeIndex,
  options: props.options,
  onSelect: (option: Option) => {
    emit('update:modelValue', option.kod)
    isOpen.value = false
  },
  onActiveIndexChange: scrollActiveOptionIntoView
})

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    // Find the index of the selected option
    const selectedIndex = props.options.findIndex(opt => 
      opt.kod === props.modelValue || (!props.modelValue && opt.kod === props.defaultValue)
    )
    activeIndex.value = selectedIndex >= 0 ? selectedIndex : 0

    // Reset scroll position after a short delay to ensure the dropdown is visible
    setTimeout(() => {
      if (listboxRef.value) {
        const selectedOption = listboxRef.value.children[activeIndex.value] as HTMLElement
        if (selectedOption) {
          const optionTop = selectedOption.offsetTop
          listboxRef.value.scrollTo({
            top: optionTop,
            behavior: 'instant'
          })
        }
      }
    }, 0)
  }
}

const selectOption = (option: Option) => {
  emit('update:modelValue', option.kod)
  isOpen.value = false
  controlRef.value?.focus()
}

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as Node
  if (!controlRef.value?.contains(target) && !listboxRef.value?.contains(target)) {
    isOpen.value = false
  }
}

const handleLabelClick = () => {
  controlRef.value?.focus()
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div class="dropdown-container">
    <label 
      v-if="label" 
      :id="labelId" 
      :for="id" 
      class="dropdown-label" 
      @click="handleLabelClick"
    >
      {{ label }}
    </label>
    <div class="dropdown-select-wrapper">
      <div class="dropdown-select">
        <button
          ref="controlRef"
          type="button"
          :id="id"
          class="dropdown-control"
          :aria-expanded="isOpen"
          aria-haspopup="listbox"
          role="combobox"
          :aria-activedescendant="isOpen ? `option-${activeIndex}` : undefined"
          @click="toggleDropdown"
          @keydown="handleKeyDown"
        >
          <span class="selected-value">{{ displayValue }}</span>
          <ChevronIcon :class="{ 'rotate': isOpen }" />
        </button>

        <ul
          v-show="isOpen"
          ref="listboxRef"
          class="options-list"
          role="listbox"
          :aria-activedescendant="activeIndex >= 0 ? `option-${activeIndex}` : undefined"
        >
          <li
            v-for="(option, index) in options"
            :key="option.kod"
            :id="`option-${index}`"
            class="option-item"
            :class="{
              'active': index === activeIndex,
              'selected': option.kod === modelValue || (!modelValue && option.kod === defaultValue)
            }"
            role="option"
            :aria-selected="option.kod === modelValue || (!modelValue && option.kod === defaultValue)"
            @click="selectOption(option)"
            @mouseover="activeIndex = index"
          >
            <span class="option-text">{{ option.namn }}</span>
            <CheckIcon v-if="option.kod === modelValue || (!modelValue && option.kod === defaultValue)" class="option-check" />
          </li>
        </ul>
      </div>
      <Tooltip 
        v-if="tooltip" 
        :text="tooltip" 
        :labelledBy="labelId"
      />
    </div>
  </div>
</template>

<style scoped>
.dropdown-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.dropdown-select-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.dropdown-label {
  font-size: 24px;
  color: #1a202c;
  font-weight: normal;
  cursor: pointer;
}

.dropdown-select {
  position: relative;
  width: 100%;
  max-width: 300px;
  font-family: inherit;
}

.dropdown-control {
  width: 100%;
  padding: 8px 16px;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  font-size: 14px;
  color: #1a202c;
  transition: all 0.2s;
}

.dropdown-control:hover {
  border-color: #cbd5e0;
}

.dropdown-control:focus {
  outline: none;
  border-color: #4299e1;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.15);
}

.selected-value {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.options-list {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  max-height: calc(36px * 3);
  overflow-y: auto;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  z-index: 10;
  margin: 0;
  padding: 4px 0;
  list-style: none;
  scroll-behavior: smooth;
}

.options-list::-webkit-scrollbar {
  width: 8px;
}

.options-list::-webkit-scrollbar-track {
  background: #f7fafc;
}

.options-list::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 4px;
}

.option-item {
  height: 36px;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 14px;
  color: #1a202c;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.option-text {
  flex: 1;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.option-check {
  margin-left: 8px;
  flex-shrink: 0;
}

.option-item:hover,
.option-item.active {
  background-color: #f7fafc;
}

.option-item.selected {
  background-color: #ebf8ff;
  font-weight: 500;
}

.rotate {
  transform: rotate(180deg);
}
</style>