<script setup lang="ts">
import { ref } from 'vue';

import { Slider } from 'ant-design-vue';

defineOptions({
  name: 'SliderItem',
});

const props = withDefaults(
  defineProps<{
    disabled?: boolean;
    max?: number;
    min?: number;
    tip?: string;
  }>(),
  {
    disabled: false,
    tip: '',
    max: 100,
    min: 0,
  },
);

const sliderValue = ref<number>();
const value = defineModel<number>();

function handleChange(newValue: number) {
  value.value = newValue;
}
</script>

<template>
  <div
    :class="{
      'pointer-events-none opacity-50': disabled,
    }"
    class="hover:bg-accent my-1 flex w-full flex-col items-start justify-between rounded-md py-2.5 pl-2 pr-4"
  >
    <span class="flex w-full items-center text-sm">
      <slot></slot>
    </span>
    <span v-if="$slots.shortcut" class="ml-auto mr-2 text-xs opacity-60">
      <slot name="shortcut"></slot>
    </span>
    <Slider
      v-model:value="sliderValue"
      :disabled="disabled"
      :max="props.max"
      :min="props.min"
      class="mt-2 w-full"
      @after-change="handleChange"
    />
  </div>
</template>
