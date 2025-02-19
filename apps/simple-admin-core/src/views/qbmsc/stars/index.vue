<script lang="ts" setup>
import type { ChapterInfo } from '#/api/qbms/model/psChapterModel';
import type { QuestionInfo } from '#/api/qbms/model/questionModel';

import {
  fetchAndTransformChapterList,
  findSiblingLeafNodes,
} from '#/api/qbms/psChapter';
import { getQuestionList } from '#/api/qbms/question';
import { FloatSetting } from '#/components/configuration';
import Question from '#/components/questions/question.vue';
import { Button, Pagination } from 'ant-design-vue';
import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

defineOptions({
  name: 'StarSequentialPractice',
});
const route = useRoute();
const router = useRouter();

const chapter = Number.parseInt(route.params.chapter as string);
const subject = Number.parseInt(route.params.subject as string);

// 从 URL 获取 `page` 参数，默认为 1
const page = ref(Number(route.query.page) || 1);
const pageSize = ref(10);
const total = ref(0);
const questions = ref<QuestionInfo[]>([]);
const previousLeaf = ref<ChapterInfo | null>(null);
const nextLeaf = ref<ChapterInfo | null>(null);

const getQuestions = () => {
  getQuestionList({
    chapter,
    subject,
    page: page.value,
    pageSize: pageSize.value,
    star: true,
  }).then((res) => {
    questions.value = res.data.data;
    total.value = res.data.total;
  });
};

// 初始化章节信息
(async () => {
  try {
    const res = await fetchAndTransformChapterList({
      subjectId: subject,
      starCount: true,
    });
    const siblings = findSiblingLeafNodes(res, chapter);
    previousLeaf.value = siblings.previousLeaf;
    nextLeaf.value = siblings.nextLeaf;
  } catch (error) {
    console.error('Error fetching chapter tree:', error);
  }
})();

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
      <Question :index="index" :mode="1" :question="question" />
    </div>
    <div class="bg-card flex flex-col items-center p-5">
      <div
        class="flex w-full flex-col flex-nowrap items-center justify-center space-y-2 md:flex-row md:space-x-4 md:space-y-0"
      >
        <Button
          v-if="previousLeaf"
          class="order-2 md:order-1"
          @click="
            () => {
              const { path, query, hash } = route;
              const newPath = path.replace(
                /\/[^/]+\/[^/]+$/,
                `/${route.params.subject}/${previousLeaf?.key}`,
              );
              router.replace({
                path: newPath,
                query: { ...query, page: 1 },
                hash,
              });
            }
          "
        >
          &lt;&lt; {{ previousLeaf.title }}
        </Button>

        <Pagination
          v-model:current="page"
          :show-quick-jumper="false"
          :show-size-changer="false"
          :total="total"
          class="order-1 p-3 md:order-2"
        />

        <Button
          v-if="nextLeaf"
          class="order-3"
          @click="
            () => {
              const { path, query, hash } = route;
              const newPath = path.replace(
                /\/[^/]+\/[^/]+$/,
                `/${route.params.subject}/${nextLeaf?.key}`,
              );
              router.replace({
                path: newPath,
                query: { ...query, page: 1 },
                hash,
              });
            }
          "
        >
          {{ nextLeaf.title }} >>
        </Button>
      </div>
    </div>
    <FloatSetting />
  </div>
</template>
