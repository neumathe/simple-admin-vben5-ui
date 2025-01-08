<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, type PropType, ref } from 'vue';

import { type QuestionInfo } from '#/api/qbms/model/questionModel';

import Latex from './template/latex.vue';

const props = defineProps({
  question: {
    type: Object as PropType<QuestionInfo>,
    default: () => ({}),
  },
});

const radioChoice = ref<number>(0);

// 获取屏幕宽度
const screenWidth = ref(window.innerWidth);

const updateScreenWidth = () => {
  screenWidth.value = window.innerWidth;
};

onMounted(() => {
  window.addEventListener('resize', updateScreenWidth);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateScreenWidth);
});

const columnClass = computed(() => {
  if (!props.question.choice || props.question.choice.length === 0) {
    return 'grid-cols-1';
  }

  // TODO: 后续字体大小支持设置 这里也要根据字体计算
  const charLimit = screenWidth.value / 20;

  for (let i = 0; i < props.question.choice.length - 1; i++) {
    if (
      (props.question.choice[i]?.choice?.length ?? 0) +
        (props.question.choice[i + 1]?.choice?.length ?? 0) >
      charLimit
    ) {
      return 'grid-cols-1';
    }
  }

  // 默认使用双列
  return 'grid-cols-2';
});

function selectOption(optionId: number) {
  radioChoice.value = optionId;
}
</script>
<template>
  <div class="w-full">
    <div class="inline-block w-full overflow-x-auto py-2">
      <Latex :value="props.question.question" class="break-words" />
    </div>

    <!-- 选项部分 -->
    <div :class="`grid gap-4 ${columnClass} py-2`">
      <label
        v-for="option in props.question.choice"
        :key="option.id"
        :class="[
          {
            'border-success-600 text-success-600':
              radioChoice === option.id && option.isAnswer,
            'border-red-600 text-red-600':
              radioChoice === option.id && !option.isAnswer,
          },
        ]"
        :for="`option-${option.id}`"
        class="flex cursor-pointer items-center gap-3 rounded-md border p-3 transition-all duration-200"
        @click="option.id !== undefined && selectOption(option.id)"
      >
        <input
          :id="`option-${option.id}`"
          :checked="radioChoice === option.id"
          :value="option.id"
          class="hidden"
          type="radio"
        />
        <span>
          <div class="inline-block w-full overflow-x-auto">
            <Latex :value="option.choice" class="break-words" />
          </div>
        </span>
      </label>
    </div>

    <div class="inline-block w-full overflow-x-auto py-2">
      <Latex :value="props.question.analysis" class="break-words" />
    </div>
  </div>
</template>
