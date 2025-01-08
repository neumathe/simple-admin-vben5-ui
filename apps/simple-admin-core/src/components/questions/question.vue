<script lang="ts" setup>
import { onBeforeUnmount, onMounted, type PropType, ref } from 'vue';

import { type QuestionInfo } from '#/api/qbms/model/questionModel';

import SingleChoice from './question/singleChoice.vue';

const props = defineProps({
  question: {
    type: Object as PropType<QuestionInfo>,
    default: () => ({}),
  },
  index: {
    type: Number,
    default: null,
  },
});

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
</script>
<template>
  <div class="bg-card m-5 flex flex-col rounded-lg shadow-xl">
    <!-- 头部操作区 -->
    <div class="flex items-center justify-between px-4 py-3">
      <!-- 左侧题目序号 -->
      <div class="flex items-center">
        <div
          class="border-primary text-primary flex h-6 w-6 items-center justify-center rounded-full border-2"
        >
          {{ props.index }}
        </div>
      </div>
      <!-- 右侧操作按钮 -->
      <div class="flex space-x-2">
        <Button icon="star" />
        <Button icon="comment" />
        <Button icon="exclamation-circle" />
        <Button icon="edit" />
        <Button icon="database" />
        <Button icon="history" />
        <Button icon="eye" />
      </div>
    </div>
    <hr class="border-t" />

    <div class="flex flex-col xl:flex-row xl:divide-x">
      <!-- 左侧元素 -->
      <div class="order-4 m-1 p-4 xl:order-none xl:w-1/4">评论区域</div>
      <!-- 中间元素 -->
      <div
        class="order-2 mx-4 mb-6 max-w-full gap-4 border-none px-6 xl:order-none xl:w-1/2"
      >
        <!-- 问题部分  QuestionType = 1 单选题 -->
        <SingleChoice
          v-if="props.question.questionType === 1"
          :question="props.question"
          class="max-w-full gap-4 border-none xl:order-none xl:w-1/2"
        />
      </div>
      <!-- 右侧元素 -->
      <div class="order-3 m-1 border-none p-4 xl:order-none xl:w-1/4">
        笔记区域
      </div>
    </div>
  </div>
</template>
