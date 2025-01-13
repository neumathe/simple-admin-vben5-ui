<script lang="ts" setup>
import {
  computed,
  onBeforeUnmount,
  onMounted,
  type PropType,
  ref,
  watch,
} from 'vue';

import {
  type QuestionChoiceInfo,
  type QuestionInfo,
} from '#/api/qbms/model/questionModel';

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
});

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
  if (!props.showAnswer) {
    radioChoice.value = optionId;
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
          {
            'border-success-600 text-success-600':
              radioChoice === option.id && option.isAnswer,
            'border-red-600 text-red-600':
              radioChoice === option.id && !option.isAnswer,
          },
        ]"
        :for="`option-${option.id}`"
        class="flex cursor-pointer items-center gap-3 overflow-x-auto rounded-md border p-3 transition-all duration-200"
        @click="
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

    <transition name="analysis">
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
  transition:
    height 0.5s ease,
    opacity 0.5s ease;
}

.analysis-enter-from,
.analysis-leave-to {
  height: 0;
  opacity: 0;
}

.analysis-enter-to,
.analysis-leave-from {
  height: auto;
  opacity: 1;
}
</style>
