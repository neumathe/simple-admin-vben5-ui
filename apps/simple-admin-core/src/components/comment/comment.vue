<script setup lang="ts">
import { useUserStore } from '@vben/stores';
import { Avatar, Input } from 'ant-design-vue';
import { computed } from 'vue';

// const props = defineProps({
//   user: {
//     type: Object as PropType<UserInfo>,
//     default: null,
//   },
// });

const userStore = useUserStore();

const firstLetter = computed(() =>
  userStore.userInfo?.realName
    ? userStore.userInfo?.realName.toUpperCase()[0]
    : '',
);
</script>

<template>
  <div class="mt-4">
    <div class="box-border flex min-w-0 flex-1">
      <Avatar
        v-if="userStore.userInfo?.avatar !== ''"
        :src="userStore.userInfo?.avatar"
        class="m-0 mr-2.5 box-border h-10 w-10 min-w-0 max-w-full flex-none rounded-[3px] bg-white"
        size="default"
      />
      <Avatar v-else>
        {{ firstLetter }}
      </Avatar>
      <div
        class="m-0 box-border min-w-0 flex-1 rounded border border-[#ebeced] px-3"
      >
        <Input
          class="input h-full w-full border-none shadow-none outline-none focus:shadow-none"
          placeholder="理性发言，友善互动"
        />
      </div>
    </div>
  </div>
</template>
