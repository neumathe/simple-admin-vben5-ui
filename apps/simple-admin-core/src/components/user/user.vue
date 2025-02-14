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
});

const firstLetter = computed(() =>
  props.user.nickname ? props.user.nickname.toUpperCase()[0] : '',
);
</script>

<template>
  <div class="flex items-center" v-if="props.user">
    <Avatar
      v-if="props.user.avatar !== ''"
      :src="props.user.avatar"
      size="default"
    />
    <Avatar v-else>
      {{ firstLetter }}
    </Avatar>
    <div class="ml-2">
      <div class="text-left text-lg font-bold leading-tight">
        {{ props.user.nickname }}
      </div>
      <div class="text-secondary-foreground text-left text-sm leading-none">
        {{ props.user.description }}
      </div>
    </div>
  </div>
</template>

<style>
.dark .text-secondary-foreground {
  color: #757d8d;
}
</style>
