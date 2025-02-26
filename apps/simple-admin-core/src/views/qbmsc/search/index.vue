<script lang="ts" setup>
import type { PsSubjectInfo } from '#/api/qbms/model/psSubjectModel';
import type { QuestionInfo } from '#/api/qbms/model/questionModel';

import { getPsSubjectList } from '#/api/qbms/psSubject';
import { SearchQuestion } from '#/api/qbms/question';
import Question from '#/components/questions/question.vue';
import {
  InputSearch,
  message,
  Pagination,
  Select,
  SelectOption,
} from 'ant-design-vue';
import { ref, watch } from 'vue';

defineOptions({
  name: 'SequentialPractice',
});

const input = ref('');
const loading = ref(false);
const subject = ref(1);
const subjects = ref<PsSubjectInfo[]>([]);
const page = ref(1);
const pageSize = ref(10);
const total = ref(0);
const questions = ref<QuestionInfo[]>([]);

getPsSubjectList().then((res) => {
  subjects.value = res.data.data;
});

const getQuestions = () => {
  if (loading.value) return;
  if (subject.value === 0) return;
  if (input.value === '') return;
  loading.value = true;
  SearchQuestion({
    page: page.value,
    pageSize: pageSize.value,
    subject: subject.value,
    query: input.value,
  })
    .then((res) => {
      if (res.data.data.length === 0) {
        message.warning('没有找到相关题目');
      }
      questions.value = res.data.data;
      total.value = res.data.total;
    })
    .finally(() => {
      loading.value = false;
    });
};

watch(page, () => {
  questions.value = [];
  getQuestions();
});
</script>

<template>
  <div>
    <div class="bg-card flex flex-col items-center p-5">
      <InputSearch
        placeholder="使用空格分隔多个搜索词，尽量使用中文文字部分或简单公式部分搜索"
        v-model:value="input"
        @search="getQuestions"
        class="w-full md:w-3/4"
        :loading="loading"
      >
        <template #addonBefore>
          <div class="w-1/4">
            <Select v-model:value="subject">
              <SelectOption v-for="s in subjects" :key="s.id" :value="s.id">
                {{ s.name }}
              </SelectOption>
            </Select>
          </div>
        </template>
      </InputSearch>
    </div>
    <div v-for="(question, index) in questions" :key="question.id">
      <Question :index="index" :mode="2" :question="question" />
    </div>
    <div class="bg-card flex flex-col items-center p-5">
      <div
        class="flex w-full flex-col flex-nowrap items-center justify-center space-y-2 md:flex-row md:space-x-4 md:space-y-0"
      >
        <Pagination
          v-model:current="page"
          :show-quick-jumper="false"
          :show-size-changer="false"
          :total="total"
          class="p-3"
        />
      </div>
    </div>
  </div>
</template>
