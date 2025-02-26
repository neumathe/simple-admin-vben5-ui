<script lang="ts" setup>
import type { QuestionInfo } from '#/api/qbms/model/questionModel';

import { getQuestionList } from '#/api/qbms/question';
import { FloatSetting } from '#/components/configuration';
import Question from '#/components/questions/question.vue';
import { Pagination } from 'ant-design-vue';
import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

defineOptions({
  name: 'SequentialPractice',
});
const route = useRoute();
const router = useRouter();

const ebk = Number.parseInt(route.params.id as string);
const subject = Number.parseInt(route.params.subject as string);

// 从 URL 获取 `page` 参数，默认为 1
const page = ref(Number(route.query.page) || 1);
const pageSize = ref(10);
const total = ref(0);
const questions = ref<QuestionInfo[]>([]);

const getQuestions = () => {
  getQuestionList({
    subject,
    ebk,
    page: page.value,
    pageSize: pageSize.value,
  }).then((res) => {
    questions.value = res.data.data;
    total.value = res.data.total;
  });
};

// 监听 `page` 变化并更新 URL
watch(page, (newPage) => {
  router.replace({ query: { ...route.query, page: newPage } });
  getQuestions();
});

// 监听 URL 变化并同步 `page`
watch(
  route,
  (newRoute) => {
    const newPage = Number(newRoute.query.page) || 1;
    if (newPage !== page.value) {
      page.value = newPage;
    }
  },
  { deep: true },
);

onMounted(() => {
  getQuestions();
});
</script>

<template>
  <div>
    <div v-for="(question, index) in questions" :key="question.id">
      <Question
        :index="index"
        :mode="1"
        :question="question"
        :ebk="ebk"
        @refresh="getQuestions"
      />
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
    <FloatSetting />
  </div>
</template>
