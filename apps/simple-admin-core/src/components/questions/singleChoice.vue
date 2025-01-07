<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, type PropType, ref } from 'vue';

import { type QuestionInfo } from '#/api/qbms/model/questionModel';

import Latex from './latex.vue';

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
  <div
    class="bg-card m-5 flex flex-col rounded-lg shadow-xl xl:flex-row xl:divide-x"
  >
    <!-- 左侧元素 -->
    <div class="order-4 m-1 p-4 xl:order-none xl:w-1/4">评论区域</div>
    <!-- 中间元素 -->
    <div
      class="order-2 mx-4 mb-6 grid gap-4 border-none p-6 xl:order-none xl:w-1/2"
    >
      <!-- 问题部分 -->

      <div class="overflow-x-auto">
        <div class="inline-block w-full">
          <Latex :value="props.question.question" class="break-words" />
        </div>
      </div>

      <!-- 选项部分 -->
      <div :class="`grid gap-4 ${columnClass}`">
        <label
          v-for="option in props.question.choice"
          :key="option.id"
          :class="[
            {
              'border-success-500 text-success-500':
                radioChoice === option.id && option.isAnswer,
              'border-red-500 text-red-500':
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
            <Latex :value="option.choice" />
          </span>
        </label>
      </div>

      <div class="overflow-x-auto">
        <div class="inline-block w-full">
          <Latex :value="props.question.analysis" class="break-words" />
        </div>
      </div>
    </div>

    <!-- 右侧元素 -->
    <div class="order-3 m-1 border-none p-4 xl:order-none xl:w-1/4">
      笔记区域
    </div>
  </div>
</template>
