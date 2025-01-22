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
  name: 'SequentialPractice',
});
const route = useRoute();
const router = useRouter();
const chapter = Number.parseInt(route.params.chapter as string);
const subject = Number.parseInt(route.params.subject as string);
const pageSize = ref(10);
const page = ref(1);
const total = ref(0);
const questions = ref<QuestionInfo[]>([]);
const previousLeaf = ref<ChapterInfo | null>();
const nextLeaf = ref<ChapterInfo | null>();

const getQuestions = () => {
  getQuestionList({
    chapter,
    subject,
    page: page.value,
    pageSize: pageSize.value,
  }).then((res) => {
    questions.value = res.data.data;
    total.value = res.data.total;
  });
};

(async () => {
  try {
    const res = await fetchAndTransformChapterList({ subjectId: subject });
    const siblings = findSiblingLeafNodes(res, chapter);
    previousLeaf.value = siblings.previousLeaf;
    nextLeaf.value = siblings.nextLeaf;
  } catch (error) {
    console.error('Error fetching chapter tree:', error);
  }
})();

watch(page, () => {
  questions.value = [];
  getQuestions();
});

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
            () =>
              router.replace(
                `/qbmsc/sequential/${route.params.subject}/${previousLeaf?.key}`,
              )
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
            () =>
              router.replace(
                `/qbmsc/sequential/${route.params.subject}/${nextLeaf?.key}`,
              )
          "
        >
          {{ nextLeaf.title }} >>
        </Button>
      </div>
    </div>
    <FloatSetting />
  </div>
</template>
