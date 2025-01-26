<script lang="ts" setup>
import type {
  QuestionChoiceInfo,
  QuestionInfo,
} from '#/api/qbms/model/questionModel';
import type { PropType } from 'vue';

import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';

import Latex from './template/latex.vue';

const props = defineProps({
  question: {
    type: Object as PropType<QuestionInfo>,
    default: () => ({}),
  },
  showAnalysis: {
    type: Boolean,
    default: false,
  },
  showAnswer: {
    type: Boolean,
    default: false,
  },
  mode: {
    type: Number,
    default: 0,
  },
});
const emits = defineEmits(['optionSelected']);

const radioChoice = ref<number>(0);
const shuffledChoices = ref<QuestionChoiceInfo[]>([]);

// 获取屏幕宽度
const screenWidth = ref(window.innerWidth);

const updateScreenWidth = () => {
  screenWidth.value = window.innerWidth;
};

onMounted(() => {
  window.addEventListener('resize', updateScreenWidth);
  shuffleOptions();

  if (props.showAnswer) {
    const correctOption = shuffledChoices.value.find(
      (option) => option.isAnswer,
    );
    if (correctOption) {
      radioChoice.value = correctOption.id!;
    }
  }

  if (props.question.input) {
    radioChoice.value = Number(props.question.input);
  }
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateScreenWidth);
});

// Shuffle function
function shuffleOptions() {
  if (props.question.choice) {
    shuffledChoices.value = [...props.question.choice].sort(
      () => Math.random() - 0.5,
    );
  }
}

const columnClass = computed(() => {
  if (!shuffledChoices.value || shuffledChoices.value.length === 0) {
    return 'grid-cols-1';
  }

  const charLimit = screenWidth.value / 20;

  for (let i = 0; i < shuffledChoices.value.length - 1; i++) {
    if (
      (shuffledChoices.value[i]?.choice?.length ?? 0) +
        (shuffledChoices.value[i + 1]?.choice?.length ?? 0) >
      charLimit
    ) {
      return 'grid-cols-1';
    }
  }

  return 'grid-cols-2';
});

function selectOption(optionId: number) {
  if (!props.showAnswer && props.mode !== 2) {
    radioChoice.value = optionId;
    emits('optionSelected', optionId);
  }
}

// Watch for changes in showAnswer
watch(
  () => props.showAnswer,
  (newValue, oldValue) => {
    if (newValue) {
      const correctOption = shuffledChoices.value.find(
        (option) => option.isAnswer,
      );
      if (correctOption) {
        radioChoice.value = correctOption.id!;
      }
    } else if (!newValue && oldValue) {
      radioChoice.value = 0;
    }
  },
);

// Disable interaction when showAnswer is true
const isDisabled = computed(() => props.showAnswer);

const beforeEnter = (el: any) => {
  el.style.height = '0';
  el.style.opacity = '0';
};

const enter = (el: any, done: () => void) => {
  const height = el.scrollHeight + 2;
  el.style.height = `${height}px`;
  el.style.opacity = '1';
  el.style.transition = 'height 0.5s ease, opacity 0.5s ease';
  el.addEventListener('transitionend', () => {
    el.style.height = 'auto';
    done();
  });
};

const leave = (el: any, done: () => void) => {
  el.style.height = `${el.scrollHeight + 2}px`;
  el.style.opacity = '1';
  requestAnimationFrame(() => {
    el.style.height = '0';
    el.style.opacity = '0';
    el.style.transition = 'height 0.5s ease, opacity 0.5s ease';
    el.addEventListener('transitionend', done);
  });
};
</script>

<template>
  <div class="w-full">
    <Latex :value="props.question.question" class="overflow-x-auto py-2" />

    <!-- 选项部分 -->
    <div :class="`grid gap-4 ${columnClass} py-2`">
      <label
        v-for="option in shuffledChoices"
        :key="option.id"
        :class="[
          props.mode === 1 && {
            'border-success-600 text-success-600':
              radioChoice === option.id && option.isAnswer,
            'border-red-600 text-red-600':
              radioChoice === option.id && !option.isAnswer,
          },
          props.mode === 11 && {
            'border-primary-600 text-primary-600': radioChoice === option.id,
          },
          props.mode === 2 && {
            'border-success-600 text-success-600':
              (option.isAnswer && props.question.input === String(option.id)) ||
              (props.question.input &&
                props.question.input !== '' &&
                option.isAnswer),
            'border-red-600 text-red-600':
              props.question.input === String(option.id),
            'border-primary-600 text-primary-600':
              !props.question.input && option.isAnswer,
          },
        ]"
        :for="`option-${option.id}`"
        class="flex cursor-pointer items-center gap-3 overflow-x-auto rounded-md border p-3 transition-all duration-200"
        @click.prevent="
          !isDisabled && option.id !== undefined && selectOption(option.id)
        "
      >
        <input
          :id="`option-${option.id}`"
          :checked="radioChoice === option.id"
          :disabled="isDisabled"
          :value="option.id"
          class="hidden"
          type="radio"
        />
        <span>
          <Latex :value="option.choice" />
        </span>
      </label>
    </div>

    <transition
      name="analysis"
      @before-enter="beforeEnter"
      @enter="enter"
      @leave="leave"
    >
      <div v-show="props.showAnalysis">
        <Latex :value="props.question.analysis" class="overflow-x-auto py-2" />
      </div>
    </transition>
  </div>
</template>

<style scoped>
.analysis-enter-active,
.analysis-leave-active {
  overflow: hidden;
}
</style>
