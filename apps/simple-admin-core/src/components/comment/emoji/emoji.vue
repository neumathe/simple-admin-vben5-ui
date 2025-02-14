<script lang="ts" setup>
import { Button, Popover } from 'ant-design-vue';
import { defineEmits } from 'vue';

import emojis from './emojis';

const emit = defineEmits(['emojiSelected']);

function selectEmoji(emoji: string) {
  emit('emojiSelected', emoji);
}
</script>

<template>
  <Popover trigger="hover" overlay-class-name="emoji-popover">
    <template #title>
      <div></div>
    </template>
    <template #content>
      <div class="emoji-picker max-h-60 overflow-auto">
        <div class="emoji-list">
          <span
            v-for="emoji in emojis"
            :key="emoji"
            class="emoji"
            @click="selectEmoji(emoji)"
          >
            {{ emoji }}
          </span>
        </div>
      </div>
    </template>
    <Button class="h-full w-[40px] px-3 text-lg"> 😀 </Button>
  </Popover>
</template>

<style scoped>
.emoji-picker {
  display: flex;
  flex-direction: column;
  width: 200px;
}

.emoji-list {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 10px;
}

.emoji {
  cursor: pointer;
  font-size: 30px;
}
</style>
<style>
.emoji-popover .ant-popover-inner {
  padding: 0px;
  padding-left: 10px;
}
</style>
