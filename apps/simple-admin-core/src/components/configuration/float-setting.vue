<script lang="ts" setup>
import { useQuestionConfig } from '#/store/questionConfig';
import { SettingOutlined } from '@ant-design/icons-vue';
import { SwitchItem } from '@vben/layouts';
import { FloatButtonGroup } from 'ant-design-vue';

import SliderItem from './base/slider-item.vue';

const questionStore = useQuestionConfig();
</script>
<template>
  <FloatButtonGroup class="bottom-[4.5rem]" shape="circle" trigger="click">
    <template #icon>
      <SettingOutlined />
    </template>
    <div
      class="bg-card border-box relative -left-[170px] w-[210px] rounded-md border p-2"
    >
      <SwitchItem v-model="questionStore.showAnswer"> 显示答案 </SwitchItem>
      <SwitchItem v-model="questionStore.showAnalysis"> 显示解析 </SwitchItem>
      <SwitchItem v-model="questionStore.showComment"> 显示评论 </SwitchItem>
      <SwitchItem v-model="questionStore.showNote"> 显示笔记 </SwitchItem>
      <SliderItem v-model="questionStore.fontSize" :max="10" :min="1">
        字体大小
      </SliderItem>
    </div>
  </FloatButtonGroup>
</template>
