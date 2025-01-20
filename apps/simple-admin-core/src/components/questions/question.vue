<script lang="ts" setup>
import {
  computed,
  h,
  onBeforeUnmount,
  onMounted,
  type PropType,
  ref,
} from 'vue';

import { Icon } from '@iconify/vue';
import { Button, Tooltip } from 'ant-design-vue';

import { type QuestionInfo } from '#/api/qbms/model/questionModel';
import { createStar, deleteStar } from '#/api/qbms/psStar';
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
    const remainingTime = Math.max(500 - elapsed, 0);

    setTimeout(() => {
      staring.value = false;
    }, remainingTime);
  });
};

// 元素高度 计算高度过渡动画
const container = ref(null);
const content = ref(null);
const animatedHeight = ref('auto');
let resizeObserver = null;

const updateHeight = () => {
  if (content.value && container.value) {
    const contentHeight = (content.value as HTMLElement)?.offsetHeight;
    (container.value as HTMLElement).style.height = `${contentHeight}px`;
    setTimeout(() => {
      animatedHeight.value = 'auto';
    }, 500);
  }
};

// 屏幕宽度
const screenWidth = ref(window.innerWidth);

const updateScreenWidth = () => {
  screenWidth.value = window.innerWidth;
};

onMounted(() => {
  window.addEventListener('resize', updateScreenWidth); // 监听窗口变化
  resizeObserver = new ResizeObserver(() => {
    animatedHeight.value = `${(content.value as unknown as HTMLElement)?.offsetHeight}px`;
    updateHeight();
  });
  if (content.value) {
    resizeObserver.observe(content.value);
    // 初始化高度
    updateHeight();
  }
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateScreenWidth);
});

const showAnalysis = ref(false);
const showComment = ref(false);
const showNote = ref(false);

const questionConfigStore = useQuestionConfig();

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
</script>
<template>
  <div
    ref="container"
    class="bg-card m-5 flex flex-col rounded-lg shadow-xl transition-[height] duration-500 ease-in-out"
    style="transition: height 0.5s ease"
  >
    <div ref="content">
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
                backgroundColor: showAnalysis ? '#DEFF0A' : '#f0f0f0',
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
              :style="{
                backgroundColor: showAnalysis ? '#FF8700' : '#f0f0f0',
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
        <Transition name="element">
          <div
            v-if="
              (questionConfigStore.showComment || showComment) &&
              props.mode < 10
            "
            class="order-4 bg-blue-50 xl:order-none xl:w-1/4"
          >
            <div class="m-1 p-4">评论区域</div>
          </div>
        </Transition>

        <!-- 中间元素 -->
        <div
          :class="{
            'xl:w-1/2': contentWidth === 2,
            'xl:w-3/4': contentWidth === 1,
            'xl:w-full': contentWidth === 0,
          }"
          class="order-2 mx-4 mb-6 max-w-full gap-4 border-none px-6 xl:order-none"
          style="transition: width 0.5s ease"
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
        <transition name="element">
          <div
            v-show="
              ((questionConfigStore.showNote || showNote) && props.mode < 10) ||
              (props.mode >= 10 && showNote)
            "
            class="order-3 border-none bg-red-50 xl:order-none xl:ml-auto xl:w-1/4"
          >
            <div class="m-1 p-4" style="min-height: 400px">笔记区域</div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>
<style scoped>
.element-enter-active,
.element-leave-active {
  overflow: hidden;
  transition:
    height 0.5s ease,
    opacity 0.5s ease,
    transform 0.5s ease;
}

.element-enter-from,
.element-leave-to {
  height: 0;
  opacity: 0;
}

.element-enter-to,
.element-leave-from {
  height: auto;
  opacity: 1;
}

@media (min-width: 1280px) {
  .element-enter-active,
  .element-leave-active {
    overflow: hidden;
    transition:
      opacity 0.5s ease,
      width 0.5s ease;
  }

  .element-enter-from,
  .element-leave-to {
    width: 0;
    height: auto;
    opacity: 0;
  }

  .element-enter-to,
  .element-leave-from {
    width: 25%;
    height: auto;
    opacity: 1;
  }
}
</style>
