<script lang="ts" setup>
import { onBeforeUnmount, onMounted, type PropType, ref } from 'vue';

import { Icon } from '@iconify/vue';
import { Button, Tooltip } from 'ant-design-vue';

import { type QuestionInfo } from '#/api/qbms/model/questionModel';
import { useQuestionConfig } from '#/store/questionConfig';

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

const showAnalysis = ref(false);
const questionConfigStore = useQuestionConfig();
</script>
<template>
  <div
    class="bg-card m-5 flex flex-col rounded-lg shadow-xl transition-[height] duration-1000 ease-in-out"
    style="interpolate-size: allow-keywords; height: auto"
  >
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
        <Tooltip title="显示解析">
          <Button
            v-if="!questionConfigStore.showAnalysis"
            :style="{
              backgroundColor: showAnalysis ? '#1890ff' : '#f0f0f0',
              color: showAnalysis ? '#fff' : '#000',
            }"
            shape="circle"
            @click="
              () => {
                showAnalysis = !showAnalysis;
              }
            "
          >
            <Icon class="m-auto" icon="lineicons:search" />
          </Button>
        </Tooltip>
        <Tooltip title="收藏题目">
          <Button
            v-if="!questionConfigStore.showAnalysis"
            :style="{
              backgroundColor: showAnalysis ? '#52c41a' : '#f0f0f0',
              color: showAnalysis ? '#fff' : '#000',
            }"
            shape="circle"
            @click="
              () => {
                showAnalysis = !showAnalysis;
              }
            "
          >
            <Icon class="m-auto" icon="raphael:star2off" />
          </Button>
        </Tooltip>
        <Tooltip title="加入错题本">
          <Button
            v-if="!questionConfigStore.showAnalysis"
            :style="{
              backgroundColor: showAnalysis ? '#ff4d4f' : '#f0f0f0',
              color: showAnalysis ? '#fff' : '#000',
            }"
            shape="circle"
            @click="
              () => {
                showAnalysis = !showAnalysis;
              }
            "
          >
            <Icon class="m-auto" icon="material-symbols:add-notes-outline" />
          </Button>
        </Tooltip>
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
          :show-analysis="showAnalysis || questionConfigStore.showAnalysis"
          :show-answer="questionConfigStore.showAnswer"
          class="max-w-full gap-4 border-none xl:order-none"
        />
      </div>
      <!-- 右侧元素 -->
      <div class="order-3 m-1 border-none p-4 xl:order-none xl:w-1/4">
        笔记区域
      </div>
    </div>
  </div>
</template>
