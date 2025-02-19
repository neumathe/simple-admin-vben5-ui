<script lang="ts" setup>
import type { QuestionInfo } from '#/api/qbms/model/questionModel';
import type { PropType } from 'vue';

import { addToEbk } from '#/api/qbms/psEbk';
import { createStar, deleteStar } from '#/api/qbms/psStar';
import { Comment } from '#/components/comment/';
import { Note } from '#/components/note/';
import { useQuestionConfig } from '#/store/questionConfig';
import { Icon } from '@iconify/vue';
import { useVbenModal } from '@vben/common-ui';
import { Button, message, Tooltip } from 'ant-design-vue';
import { computed, h, onBeforeUnmount, onMounted, ref } from 'vue';

import ExtraModal from './ebkChoiceModal.vue';
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
  mode: {
    type: Number,
    default: 0,
  },
});

const emits = defineEmits(['input']);

function handleOptionSelected(optionId: number) {
  emits('input', props.index, optionId);
}

const star = ref(props.question.star);
const staring = ref(false);
const toggleStar = () => {
  staring.value = true;
  const startTime = Date.now();

  const starPromise = star.value
    ? deleteStar({
        question: props.question.id,
        subject: props.question.subjectId!,
      }).then(() => {
        star.value = !star.value;
      })
    : createStar({
        question: props.question.id,
        subject: props.question.subjectId!,
      }).then(() => {
        star.value = !star.value;
      });

  starPromise.finally(() => {
    const elapsed = Date.now() - startTime;
    const remainingTime = Math.max(100 - elapsed, 0);

    setTimeout(() => {
      staring.value = false;
    }, remainingTime);
  });
};

// 屏幕宽度
const screenWidth = ref(window.innerWidth);

const updateScreenWidth = () => {
  screenWidth.value = window.innerWidth;
};

onMounted(() => {
  window.addEventListener('resize', updateScreenWidth); // 监听窗口变化
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateScreenWidth);
});

const showAnalysis = ref(false);
const showComment = ref(false);
const showNote = ref(false);

const questionConfigStore = useQuestionConfig();

const addingToEbk = ref(false);
const [Modal, modalApi] = useVbenModal({
  connectedComponent: ExtraModal,
});
const addQuestionToEbk = () => {
  addingToEbk.value = true;
  addToEbk({
    qustionId: props.question.id,
  })
    .then((res) => {
      if (res.code === 0) {
        message.success(res.msg);
      }
      if (res.code === -1) {
        modalApi
          .setData({
            question: props.question,
          })
          .open();
      }
    })
    .finally(() => {
      addingToEbk.value = false;
    });
};

const contentWidth = computed(() => {
  if (props.mode < 10) {
    if (
      (questionConfigStore.showComment || showComment.value) &&
      (questionConfigStore.showNote || showNote.value)
    ) {
      return 2;
    }
    if (
      questionConfigStore.showComment ||
      showComment.value ||
      questionConfigStore.showNote ||
      showNote.value
    ) {
      return 1;
    }
  } else {
    if (showNote.value) {
      return 1;
    }
  }

  return 0;
});

const beforeEnter = (el: any) => {
  el.style.height = '0';
  el.style.opacity = '0';
};

const enter = (el: any, done: () => void) => {
  // 确保元素的高度和透明度在获取 scrollHeight 之前是自然状态
  el.style.height = 'auto';
  el.style.opacity = '1';
  const height = el.scrollHeight; // 获取元素的实际高度
  el.style.height = '0px'; // 设置初始高度为0
  el.style.opacity = '0'; // 设置初始透明度为0
  el.style.maxHeight = `${height}px`;
  el.style.overflow = 'hidden';
  requestAnimationFrame(() => {
    el.style.transition = 'height 0.5s ease-in-out, opacity 0.5s ease-in-out';
    el.style.height = `${height}px`;
    el.style.opacity = '1';
  });

  el.addEventListener('transitionend', () => {
    el.style.height = 'auto'; // 恢复到 auto，确保后续内容不受限制
    done();
  });
};

const leave = (el: any, done: () => void) => {
  el.style.height = `${el.scrollHeight}px`; // 先设置固定高度
  el.style.opacity = '1';
  el.style.visibility = 'visible';
  requestAnimationFrame(() => {
    el.style.transition = 'height 0.5s ease-in-out, opacity 0.5s ease-in-out';
    el.style.height = '0';
    el.style.opacity = '0';
  });

  el.addEventListener('transitionend', (event: TransitionEvent) => {
    if (event.propertyName === 'opacity') {
      done();
    }
  });
};

// Disable interaction when showAnswer is true
// const isDisabled = computed(() => props.showAnswer);
</script>
<template>
  <div class="bg-card m-5 flex flex-col rounded-lg shadow-xl">
    <div>
      <!-- 头部操作区 -->
      <div class="flex items-center justify-between px-4 py-3">
        <!-- 左侧题目序号 -->
        <div class="flex items-center">
          <div
            class="border-primary text-primary flex h-6 w-6 items-center justify-center rounded-full border-2"
          >
            {{ props.index + 1 }}
          </div>
        </div>
        <!-- 右侧操作按钮 -->
        <div class="flex space-x-2">
          <!-- https://coolors.co/palette/ff0000-ff8700-ffd300-deff0a-a1ff0a-0aff99-0aefff-147df5-580aff-be0aff -->
          <Tooltip
            v-if="
              !questionConfigStore.showAnalysis &&
              props.mode < 10 &&
              props.mode !== 2
            "
            title="展开解析"
          >
            <Button
              :style="{
                backgroundColor: showAnalysis ? '#cbe86b' : '#f0f0f0',
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
          <Tooltip
            v-if="!questionConfigStore.showComment && props.mode < 10"
            title="显示评论"
          >
            <Button
              :style="{
                backgroundColor: showComment ? '#A1FF0A' : '#f0f0f0',
                color: showComment ? '#fff' : '#000',
              }"
              shape="circle"
              @click="
                () => {
                  showComment = !showComment;
                }
              "
            >
              <Icon class="m-auto" icon="akar-icons:comment" />
            </Button>
          </Tooltip>
          <Tooltip
            v-if="!questionConfigStore.showNote || props.mode >= 10"
            title="显示笔记"
          >
            <Button
              :style="{
                backgroundColor: showNote ? '#0AFF99' : '#f0f0f0',
                color: showNote ? '#fff' : '#000',
              }"
              shape="circle"
              @click="
                () => {
                  showNote = !showNote;
                }
              "
            >
              <Icon class="m-auto" icon="simple-line-icons:note" />
            </Button>
          </Tooltip>
          <Tooltip title="收藏题目">
            <Button
              :icon="h(Icon, { icon: 'akar-icons:star' })"
              :loading="staring"
              :style="{
                backgroundColor: star ? '#FF0000' : '#f0f0f0',
                color: star ? '#fff' : '#000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }"
              shape="circle"
              @click="toggleStar"
            />
          </Tooltip>
          <Tooltip title="加入错题本">
            <Button
              shape="circle"
              @click="addQuestionToEbk"
              :loading="addingToEbk"
              :style="{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }"
              :icon="h(Icon, { icon: 'material-symbols:add-notes-outline' })"
            />
          </Tooltip>
        </div>
      </div>
      <hr class="border-t" />

      <div class="flex flex-col xl:flex-row xl:divide-x">
        <!-- 左侧元素 -->
        <transition
          name="note"
          @before-enter="beforeEnter"
          @enter="enter"
          @leave="leave"
        >
          <div
            v-show="
              (questionConfigStore.showComment || showComment) &&
              props.mode < 10
            "
            :class="
              (questionConfigStore.showComment || showComment) &&
              props.mode < 10
                ? 'xl:w-1/3'
                : 'xl:w-0'
            "
            class="transition-width order-4 border-none duration-500 xl:order-none xl:ml-auto"
          >
            <div
              class="m-1 h-full max-h-[650px] overflow-y-auto border-t p-4 xl:border-none"
            >
              <Comment
                :question="props.question.id!"
                :subject="props.question.subjectId!"
                :comments="props.question.comments?.data"
                :total="props.question.comments?.total"
              />
            </div>
          </div>
        </transition>

        <!-- 中间元素 -->
        <div
          :class="{
            'xl:w-1/2': contentWidth === 2,
            'xl:w-3/4': contentWidth === 1,
            'xl:w-full': contentWidth === 0,
          }"
          class="transition-width order-2 mx-4 mb-6 max-w-full gap-4 border-none px-6 duration-500 xl:order-none"
        >
          <!-- 问题部分  QuestionType = 1 单选题 -->
          <SingleChoice
            v-if="props.question.questionType === 1"
            :mode="props.mode"
            :question="props.question"
            :show-analysis="
              ((showAnalysis || questionConfigStore.showAnalysis) &&
                props.mode < 10) ||
              props.mode === 2
            "
            :show-answer="questionConfigStore.showAnswer && props.mode < 10"
            class="max-w-full gap-4 border-none xl:order-none"
            @option-selected="handleOptionSelected"
          />
        </div>
        <!-- 右侧元素 -->
        <transition
          name="note"
          @before-enter="beforeEnter"
          @enter="enter"
          @leave="leave"
        >
          <div
            v-show="
              ((questionConfigStore.showNote || showNote) && props.mode < 10) ||
              (props.mode >= 10 && showNote)
            "
            :class="
              ((questionConfigStore.showNote || showNote) && props.mode < 10) ||
              (props.mode >= 10 && showNote)
                ? 'xl:w-1/3'
                : 'xl:w-0'
            "
            class="transition-width order-3 border-none duration-500 xl:order-none xl:ml-auto"
          >
            <div
              class="h-full max-h-[650px] overflow-y-auto border-t xl:border-none"
            >
              <Note
                :note="props.question.note"
                :question="props.question.id!"
                :subject="props.question.subjectId!"
              />
            </div>
          </div>
        </transition>
      </div>
    </div>
    <Modal />
  </div>
</template>
<style scoped>
.comment-enter-active,
.comment-leave-active {
  will-change: transform;
}

.note-enter-active,
.note-leave-active {
  will-change: transform;
  visibility: visible;
  overflow: hidden;
}
</style>
