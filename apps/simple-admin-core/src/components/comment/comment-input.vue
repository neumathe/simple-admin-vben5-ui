<script setup lang="ts">
import { EmojiPicker } from '#/components/comment/emoji';
import { useUserStore } from '@vben/stores';
import { Avatar, Button, Input, InputGroup } from 'ant-design-vue';
import { nextTick, onMounted, ref, watch } from 'vue';

const props = defineProps({
  isSubmiting: {
    type: Boolean,
    default: false,
  },
  placeholder: {
    type: String,
    default: '理性发言，友善互动',
  },
  input: {
    type: String,
    default: '',
  },
  focus: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:input', 'submit']);

const userStore = useUserStore();
const cursorPos = ref(0); // 记录光标位置

const input = ref(props.input);
const inputRef = ref<InstanceType<typeof Input> | null>(null);

watch(
  () => props.input,
  (newVal) => {
    input.value = newVal;
  },
);

onMounted(() => {
  if (props.focus) {
    nextTick(() => {
      const el = inputRef.value?.$el;
      el.focus();
    });
  }
});

// 选中 Emoji 并保持光标位置
const selectEmoji = (emoji: string) => {
  const el = inputRef.value?.$el;
  if (!el) return;

  const start = el.selectionStart ?? input.value.length;
  const end = el.selectionEnd ?? input.value.length;

  input.value = input.value.slice(0, start) + emoji + input.value.slice(end);
  emit('update:input', input.value);

  nextTick(() => {
    const el = inputRef.value?.$el;
    const newPos = start + emoji.length;
    cursorPos.value = newPos;
    el.setSelectionRange(newPos, newPos);
    el.focus();
  });
};

// 失焦时保存光标位置
const saveCursorPos = () => {
  const el = inputRef.value?.$el;
  if (el) {
    cursorPos.value = el.selectionStart ?? input.value.length;
  }
};

// 恢复光标位置
const restoreCursorPos = () => {
  nextTick(() => {
    const el = inputRef.value?.$el;
    if (el) {
      el.setSelectionRange(cursorPos.value, cursorPos.value);
    }
  });
};

const getFallbackText = (name: string | undefined) => {
  if (!name) return ' ';
  const firstChar = name.charAt(0);
  return /^[a-z]$/i.test(firstChar) ? firstChar.toUpperCase() : firstChar;
};
</script>
<template>
  <div class="mt-4">
    <div class="box-border flex min-w-0 flex-1">
      <Avatar
        v-if="userStore.userInfo?.avatar !== ''"
        :src="userStore.userInfo?.avatar"
        class="m-0 my-auto box-border h-10 w-10 min-w-0 max-w-full flex-none bg-white"
        :size="30"
      />
      <Avatar v-else>
        {{ getFallbackText(userStore.userInfo?.realName) }}
      </Avatar>
      <div class="m-0 flex-1 rounded px-3">
        <InputGroup compact class="h-full">
          <Input
            ref="inputRef"
            class="input box-border h-full min-w-0 shadow-none outline-none focus:shadow-none"
            :placeholder="props.placeholder"
            style="width: calc(100% - 80px)"
            v-model:value="input"
            @change="() => emit('update:input', input)"
            @blur="saveCursorPos"
            @focus="restoreCursorPos"
          />
          <EmojiPicker @emoji-selected="selectEmoji" />
          <Button
            class="h-full w-[40px] px-3"
            type="primary"
            @click="() => emit('submit')"
            :loading="props.isSubmiting"
          >
            →
          </Button>
        </InputGroup>
      </div>
    </div>
  </div>
</template>
