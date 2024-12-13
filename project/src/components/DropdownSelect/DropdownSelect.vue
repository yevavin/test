<template>
  <div class="dropdown">
    <div class="dropdown__label-wrapper">
      <label v-if="label" :for="'dropdown-' + id" :id="'dropdownLabel-' + id" class="dropdown__label"
        >{{ label }}
      </label>
      <Tooltip v-if="tooltip" :text="tooltip" :labelledBy="'dropdownLabel-' + id"></Tooltip>
    </div>
    <div class="dropdown__select">
      <button
        ref="controlRef"
        type="button"
        :id="'dropdown-' + id"
        class="dropdown__control"
        :aria-expanded="isOpen"
        aria-haspopup="listbox"
        role="combobox"
        :aria-activedescendant="isOpen ? `option-${activeIndex}` : undefined"
        @click="toggleDropdown"
        @keydown="handleKeyDown"
      >
        <span class="dropdown__selected-value">{{ displayValue }}</span>
        <ChevronIcon class="dropdown__chevron" :class="{ dropdown__chevron_rotated: isOpen }" />
      </button>

      <ul
        v-show="isOpen"
        ref="listboxRef"
        class="dropdown__options"
        role="listbox"
        :aria-activedescendant="activeIndex >= 0 ? `option-${activeIndex}` : undefined"
      >
        <li
          v-for="(option, index) in options"
          :key="option.kod"
          :id="`option-${index}`"
          class="dropdown__option"
          :class="{
            dropdown__option_active: index === activeIndex,
            dropdown__option_selected: option.kod === modelValue || (!modelValue && option.kod === defaultValue),
          }"
          role="option"
          :aria-selected="option.kod === modelValue || (!modelValue && option.kod === defaultValue)"
          @click="selectOption(option)"
          @mouseover="activeIndex = index"
        >
          <span class="dropdown__option-text">{{ option.namn }}</span>
          <CheckIcon
            v-if="option.kod === modelValue || (!modelValue && option.kod === defaultValue)"
            class="dropdown__option-check"
          />
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import type { Option } from './types'
import { useKeyboard } from './useKeyboard'
import Tooltip from '@/components/Tooltip/Tooltip.vue'
import ChevronIcon from '@/components/icons/ChevronIcon.vue'
import CheckIcon from '@/components/icons/CheckIcon.vue'

const props = withDefaults(
  defineProps<{
    options: Option[]
    modelValue?: string
    defaultValue?: string
    label?: string
    tooltip?: string
    id?: string
  }>(),
  {
    modelValue: undefined,
    defaultValue: undefined,
    label: undefined,
    tooltip: undefined,
    id: () => `${Math.random().toString(36).slice(2, 11)}`,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const isOpen = ref(false)
const listboxRef = ref<HTMLUListElement | null>(null)
const controlRef = ref<HTMLButtonElement | null>(null)
const activeIndex = ref(-1)

// Initialize with default value if provided
onMounted(() => {
  if (!props.modelValue && props.defaultValue) {
    emit('update:modelValue', props.defaultValue)
  }
})

const selectedOption = computed(
  () =>
    props.options.find((opt) => opt.kod === props.modelValue) ||
    props.options.find((opt) => opt.kod === props.defaultValue),
)

const displayValue = computed(() => selectedOption.value?.namn)

const scrollActiveOptionIntoView = () => {
  if (!isOpen.value || activeIndex.value < 0 || !listboxRef.value) return

  if (activeIndex.value === 0) {
    listboxRef.value.scrollTo({ top: 0 })
    return
  }

  if (activeIndex.value === props.options.length - 1) {
    listboxRef.value.scrollTo({
      top: listboxRef.value.scrollHeight - listboxRef.value.clientHeight,
    })
    return
  }

  const activeOption = listboxRef.value.children[activeIndex.value] as HTMLElement
  if (!activeOption) return

  const containerTop = listboxRef.value.scrollTop
  const containerBottom = containerTop + listboxRef.value.clientHeight
  const elementTop = activeOption.offsetTop
  const elementBottom = elementTop + activeOption.offsetHeight

  if (elementTop < containerTop || elementBottom > containerBottom) {
    // Adjust scroll to center the active option if it's not fully in view
    const scrollTop = elementTop - listboxRef.value.clientHeight / 2 + activeOption.offsetHeight / 2
    listboxRef.value.scrollTo({
      top: Math.max(0, scrollTop),
    })
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
  onActiveIndexChange: scrollActiveOptionIntoView,
})

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    activeIndex.value = props.options.findIndex((opt) => opt.kod === props.modelValue)
    scrollActiveOptionIntoView()
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

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped lang="scss">
.dropdown {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 400px;
  width: 400px;
  align-items: flex-start;

  &__label {
    font-size: 14px;
    color: #101828;
    font-weight: normal;
    margin-right: 2px;

    &-wrapper {
      display: flex;
      align-items: center;
    }
  }

  &__select {
    position: relative;
    width: 100%;
    font-family: inherit;
    text-align: left;
  }

  &__control {
    width: 100%;
    padding: 8px 14px;
    background: #fff;
    border: 1px solid #212121;
    box-shadow: 0px 1px 2px 0px rgba(16, 24, 40, 0.05);
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    font-size: 16px;
    color: #101828;
    line-height: 24px;

    &:hover {
    }

    &:focus {
      outline: none;
      box-shadow: 0 0 0 2px #000;
    }
  }

  &__selected-value {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__chevron {
    transition: transform 0.2s ease;
    color: var(--pink-900);

    &_rotated {
      transform: rotate(180deg);
    }
  }

  &__options {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    right: 0;
    max-height: 190px;
    overflow-y: auto;
    background: #fff;
    border: 1px solid var(--gray-300);
    border-radius: 4px;
    box-shadow:
      0 4px 6px -2px rgba(16, 24, 40, 0.08),
      0 12px 16px -4px rgba(16, 24, 40, 0.14);
    z-index: 10;
    margin: 0;
    padding: 4px 12px;
    list-style: none;
  }

  &__option {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 10px;
    height: 44px;
    cursor: pointer;
    font-size: 16px;
    color: #1a202c;
    border-radius: 6px;

    &:not(:last-child) {
      margin-bottom: 2px;
    }

    &:hover,
    &_active,
    &_selected {
      background-color: var(--pink-50);
    }

    &-check {
      color: var(--pink-900);
    }
  }
}
</style>
