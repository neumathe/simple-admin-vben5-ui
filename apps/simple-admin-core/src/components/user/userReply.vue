<script setup lang="ts">
import type { UserInfo } from '#/api/sys/model/userModel';
import type { PropType } from 'vue';

import { Avatar } from 'ant-design-vue';
import { computed } from 'vue';

const props = defineProps({
  user: {
    type: Object as PropType<UserInfo>,
    default: null,
  },
  replyUser: {
    type: Object as PropType<UserInfo>,
    default: null,
  },
});

const firstLetter = computed(() =>
  props.user.nickname ? props.user.nickname.toUpperCase()[0] : '',
);
</script>

<template>
  <div class="flex items-center" v-if="props.user && props.replyUser">
    <Avatar
      v-if="props.user.avatar !== ''"
      :src="props.user.avatar"
      size="default"
    />
    <Avatar v-else>
      {{ firstLetter }}
    </Avatar>
    <div class="ml-2 flex items-center space-x-1">
      <div class="text-lg font-bold leading-tight">
        {{ props.user.nickname }}
      </div>
      <svg
        width="12"
        height="12"
        viewBox="0 0 16 16"
        class="ZDI ZDI--ArrowRightAlt16 css-gx7lzm"
        fill="currentColor"
      >
        <path
          d="M10.727 7.48a.63.63 0 0 1 0 1.039l-4.299 2.88c-.399.268-.926-.028-.926-.519V5.12c0-.491.527-.787.926-.52l4.299 2.881Z"
        />
      </svg>
      <div class="text-lg font-bold leading-tight">
        {{ props.replyUser.nickname }}
      </div>
    </div>
  </div>
</template>
