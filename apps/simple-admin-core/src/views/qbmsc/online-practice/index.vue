<script lang="ts" setup>
import type { QuestionInputInfo } from '#/api/qbms/model/psOnlinePracticeModel';
import type { QuestionInfo } from '#/api/qbms/model/questionModel';

import {
  getPsOnlinePracticeById,
  submitPractice,
} from '#/api/qbms/psOnlinePractice';
import { FloatSetting } from '#/components/configuration';
import Question from '#/components/questions/question.vue';
import { Button } from 'ant-design-vue';
import Swal from 'sweetalert2';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

defineOptions({
  name: 'SequentialPractice',
});
const route = useRoute();
const id = Number.parseInt(route.params.id as string);
const questions = ref();
const timeUsed = ref(0);
const isSubmiting = ref(false);
const isFinish = ref(false);
const lastTime = ref<number>(Date.now());
const running = ref(true);

const updateTime = () => {
  if (!running.value) return;

  const currentTime = Date.now();
  const elapsedTime = (currentTime - lastTime.value) / 1000;

  if (elapsedTime >= 1) {
    timeUsed.value += Math.floor(elapsedTime);
    lastTime.value = currentTime - (elapsedTime % 1) * 1000;
  }

  requestAnimationFrame(updateTime);
};

const getQuestions = () => {
  getPsOnlinePracticeById({
    id,
  }).then((res) => {
    if (res.data.submitedAt && res.data.submitedAt > 0) {
      running.value = false;
      isFinish.value = true;
    }
    questions.value = res.data.questions;
    timeUsed.value = res.data.timeUsed ?? 0;
  });
};

const timeFormater = computed(() => {
  const hours = Math.floor(timeUsed.value / 3600)
    .toString()
    .padStart(2, '0');
  const minutes = Math.floor((timeUsed.value % 3600) / 60)
    .toString()
    .padStart(2, '0');
  const seconds = (timeUsed.value % 60).toString().padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
});

const handleSubmission = (isFinished: boolean, inputs: QuestionInputInfo[]) => {
  if (!isFinish.value) {
    submitPractice({
      id,
      isFinish: isFinished,
      timeUsed: timeUsed.value,
      input: inputs,
    })
      .then((res) => {
        if (res.isFinish) {
          Swal.fire({
            title: '提交成功',
            icon: 'success',
            text: `本次模拟考试得分是 ${res.score}分`,
          });
          getQuestions();
          running.value = false;
        }
      })
      .finally(() => {
        isSubmiting.value = false;
      });
  }
};

onMounted(() => {
  getQuestions();
  requestAnimationFrame(updateTime);
});

onBeforeUnmount(() => {
  handleSubmission(
    false,
    questions.value.map(
      (question: QuestionInfo) =>
        question.input && {
          id: question.id,
          input: question.input,
        },
    ),
  );
  running.value = false;
});

const updateInput = (index: number, value: string) => {
  questions.value[index].input = String(value);
  handleSubmission(false, [
    {
      id: questions.value[index].id,
      input: String(value),
    },
  ]);
};

const submit = () => {
  isSubmiting.value = true;
  if (
    questions.value.some(
      (question: QuestionInfo) =>
        !question.input || question.input.trim() === '',
    )
  ) {
    Swal.fire({
      title: '提交确认',
      text: `您还有${
        questions.value.filter(
          (question: QuestionInfo) =>
            !question.input || question.input.trim() === '',
        ).length
      }道未完成的题目，确定要提交吗？`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
    }).then((result) => {
      if (result.isConfirmed) {
        handleSubmission(
          true,
          questions.value.map(
            (question: QuestionInfo) =>
              question.input && {
                id: question.id,
                input: question.input,
              },
          ),
        );
      } else {
        isSubmiting.value = false;
      }
    });
  } else {
    handleSubmission(
      true,
      questions.value.map(
        (question: QuestionInfo) =>
          question.input && {
            id: question.id,
            input: question.input,
          },
      ),
    );
  }
};
</script>

<template>
  <div>
    <div v-for="(question, index) in questions" :key="question.id">
      <Question
        :index="index"
        :mode="isFinish ? 2 : 11"
        :question="question"
        @input="updateInput"
      />
    </div>
    <div v-if="!isFinish" class="min-h-[72px]"></div>
    <div
      v-if="!isFinish"
      class="bg-card fixed bottom-0 left-0 flex w-full flex-row items-center justify-center p-5"
    >
      <div class="pr-10">已用时间： {{ timeFormater }}</div>
      <Button :loading="isSubmiting" @click="submit">提交</Button>
    </div>
    <FloatSetting v-if="isFinish" />
  </div>
</template>
