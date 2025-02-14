<script setup lang="ts">
import type { CommentInfo } from '#/api/community/model/comment';
import type { PropType } from 'vue';

import {
  DeleteOutlined,
  DislikeFilled,
  DislikeOutlined,
  LikeFilled,
  LikeOutlined,
  MessageOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons-vue';
import { useUserStore } from '@vben/stores';
import { Popconfirm } from 'ant-design-vue';
import { defineEmits, ref } from 'vue';

const props = defineProps({
  comment: {
    type: Object as PropType<CommentInfo>,
    default: null,
  },
});

const emits = defineEmits(['delete', 'toggleComment', 'like']);
const userStore = useUserStore();
const comment = ref<CommentInfo>(props.comment ?? []);
</script>

<template>
  <div class="space-x-2">
    <Popconfirm
      v-if="comment.createdBy === userStore.userInfo?.userId"
      :title="
        comment.replyParentsId !== 0
          ? '确定删除？'
          : '同时将删除所有回复，确定删除？'
      "
      @confirm="() => emits('delete', comment.id!, comment.replyParentsId)"
    >
      <template #icon>
        <QuestionCircleOutlined style="color: red" />
      </template>
      <DeleteOutlined />
    </Popconfirm>
    <MessageOutlined
      @click="() => emits('toggleComment', comment.id!)"
      class="cursor-pointer"
    />
    <button
      v-if="comment.likeType === 1"
      @click="() => emits('like', comment.id!, 0, comment.replyParentsId)"
    >
      <LikeFilled style="color: hsl(var(--primary))" />
      {{ comment.like }}
    </button>
    <button
      v-else
      @click="() => emits('like', comment.id!, 1, comment.replyParentsId)"
    >
      <LikeOutlined />
      {{ comment.like }}
    </button>
    <DislikeFilled
      v-if="comment.likeType === -1"
      @click="() => emits('like', comment.id!, 0, comment.replyParentsId)"
      style="color: hsl(var(--primary))"
    />
    <DislikeOutlined
      v-else
      @click="() => emits('like', comment.id!, -1, comment.replyParentsId)"
    />
  </div>
</template>
