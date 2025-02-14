<script setup lang="ts">
import type { CommentInfo } from '#/api/community/model/comment';
import type { PropType } from 'vue';

import { CreateComment, ListComment } from '#/api/community/comment';
import { User, UserReply } from '#/components/user';
import { dateStr } from '#/utils/time';
import {
  DislikeFilled,
  DislikeOutlined,
  LikeFilled,
  LikeOutlined,
} from '@ant-design/icons-vue';
import { useUserStore } from '@vben/stores';
import { message, Modal, Skeleton } from 'ant-design-vue';
import { ref, watch } from 'vue';

import CommentInput from './comment-input.vue';
import CommentOperate from './comment-operate.vue';

const props = defineProps({
  comment: {
    type: Object as PropType<CommentInfo>,
    default: null,
  },
  subject: {
    type: Number,
    required: true,
  },
  note: {
    type: Number,
    default: undefined,
  },
  question: {
    type: Number,
    required: true,
  },
  showModal: {
    type: Boolean,
    default: false,
  },
});

const emits = defineEmits([
  'delete',
  'like',
  'update:showModal',
  'modalReliesCountChange',
]);

const userStore = useUserStore();

const showModal = ref(props.showModal);
const input = ref('');
const replyInput = ref('');
const isSubmiting = ref(false);
const comments = ref<CommentInfo[]>([]);
const activeCommentId = ref<null | number>(null);
const selectedComment = ref<CommentInfo | null>(null);
const total = ref(0);
const page = ref(1);
const loading = ref(false);

const containerRef = ref<HTMLElement | null>(null);

const loadMore = async () => {
  if (
    loading.value ||
    (comments.value.length >= total.value && total.value !== 0)
  )
    return;

  loading.value = true;
  try {
    const res = await ListComment({
      subject: props.subject,
      question: props.question,
      page: page.value,
      pageSize: 30,
      replyParentsId: props.comment.id,
      noteId: props.note,
    });

    comments.value.push(...res.data.data);
    total.value = res.data.total;
    page.value++;
  } catch (error) {
    console.error(error);
    message.error('获取评论失败');
  } finally {
    loading.value = false;
  }
};

const submit = (commentId?: number, replyParentsId?: number) => {
  if (replyParentsId === undefined) {
    // 回复根评论
    if (!input.value.trim()) {
      message.error('请输入内容');
      return;
    }
    isSubmiting.value = true;
    CreateComment({
      content: input.value,
      subject: props.subject,
      question: props.question,
      replyId: commentId,
      noteId: props.note,
    })
      .then((res) => {
        total.value = total.value + 1;
        comments.value = [
          {
            id: res.id,
            content: input.value,
            user: {
              id: userStore.userInfo?.userId,
              nickname: userStore.userInfo?.nickname,
              avatar: userStore.userInfo?.avatar,
            },
            createdAt: Date.now(),
            like: 0,
            likeType: 0,
            replies: [],
            replyParentsId: commentId,
            replyId: commentId,
            createdBy: userStore.userInfo?.userId,
          },
          ...comments.value,
        ];
        emits('modalReliesCountChange', commentId, 1);
        input.value = '';
      })
      .catch((error) => {
        console.error(error);
        message.error('发布失败');
      })
      .finally(() => {
        isSubmiting.value = false;
      });
  } else {
    // 回复其他评论
    if (!replyInput.value.trim()) {
      message.error('请输入内容');
      return;
    }

    isSubmiting.value = true;

    CreateComment({
      content: replyInput.value,
      subject: props.subject,
      question: props.question,
      replyId: commentId,
      noteId: props.note,
    })
      .then((res) => {
        total.value = total.value + 1;
        const newReply: CommentInfo = {
          id: res.id,
          content: replyInput.value,
          user: {
            id: userStore.userInfo?.userId,
            nickname: userStore.userInfo?.nickname,
            avatar: userStore.userInfo?.avatar,
          },
          createdAt: Date.now(),
          like: 0,
          likeType: 0,
          replyId: commentId,
          createdBy: userStore.userInfo?.userId,
        };

        const originalReply = comments.value.find((r) => r.id === commentId);
        newReply.replyUser = originalReply?.user;
        newReply.replyParentsId = originalReply?.replyParentsId;
        comments.value = [newReply, ...comments.value];
        replyInput.value = '';
        emits('modalReliesCountChange', commentId, 1);
      })
      .catch((error) => {
        console.error(error);
        message.error('发布失败');
      })
      .finally(() => {
        isSubmiting.value = false;
        activeCommentId.value = null;
      });
  }
};

const like = (commentId: number, type: number, replyParentsId?: number) => {
  if (replyParentsId === undefined) {
    emits('like', commentId, type);
  } else {
    emits('like', commentId, type, replyParentsId);
    comments.value = comments.value.map((comment) => {
      if (comment.id === commentId) {
        if (comment.like === undefined) {
          comment.like = 0;
        }
        if (type !== 1 && comment.likeType === 1) {
          comment.like -= 1;
        } else if (type === 1 && comment.likeType !== 1) {
          comment.like += 1;
        }
        comment.likeType = type;
        return comment;
      }
      return comment;
    });
  }
};

const toggleCommentInput = (commentId: number) => {
  replyInput.value = '';
  activeCommentId.value =
    activeCommentId.value === commentId ? null : commentId;
};

const deleteComment = (id: number, replyParentsId?: number) => {
  if (replyParentsId === undefined) {
    emits('delete', id);
  } else {
    emits('delete', id, replyParentsId);
    comments.value = comments.value.filter((comment) => comment.id !== id);
  }
  total.value = total.value - 1;
};

// 检查是否滚动到底部
const isBottom = () => {
  const container = containerRef.value;
  if (container === null) return false;
  return (
    container.scrollHeight - container.scrollTop - container.clientHeight < 30
  );
};

// 处理滚动事件
const handleScroll = async () => {
  if (loading.value) return;

  if (isBottom()) {
    try {
      loadMore();
    } catch (error) {
      console.error(error);
    }
  }
};

const openModal = async (comment: CommentInfo) => {
  selectedComment.value = comment;
  emits('update:showModal', true);
  showModal.value = true;
  replyInput.value = '';
  input.value = '';
  activeCommentId.value = 0;

  await loadMore();

  containerRef.value?.addEventListener('scroll', handleScroll);
};

const closeModal = () => {
  containerRef.value?.removeEventListener('scroll', handleScroll);
  showModal.value = false;
  emits('update:showModal', false);
  selectedComment.value = null;
  replyInput.value = '';
  input.value = '';
  activeCommentId.value = 0;
};

watch(
  () => props.showModal,
  (newVal: boolean) => {
    showModal.value = newVal;
    if (newVal) {
      openModal(props.comment);
    }
  },
);
</script>

<template>
  <Modal
    v-model:open="showModal"
    title="评论回复"
    @cancel="closeModal"
    :footer="null"
  >
    <div v-if="selectedComment !== null">
      <div class="divide-y-4">
        <div class="py-5">
          <User :user="selectedComment.user" />
          <div class="ml-10 py-1">
            <span>{{ selectedComment.content }}</span>
            <div class="flex items-center justify-between pt-1">
              <span class="text-secondary-foreground">{{
                dateStr(selectedComment.createdAt!)
              }}</span>
              <div class="space-x-2">
                <LikeFilled
                  v-if="selectedComment.likeType === 1"
                  @click="like(selectedComment.id!, 0, undefined)"
                  style="color: hsl(var(--primary))"
                />
                <LikeOutlined
                  v-else
                  @click="like(selectedComment.id!, 1, undefined)"
                />
                {{ selectedComment.like }}
                <DislikeFilled
                  v-if="selectedComment.likeType === -1"
                  @click="like(selectedComment.id!, 0, undefined)"
                  style="color: hsl(var(--primary))"
                />
                <DislikeOutlined
                  v-else
                  @click="like(selectedComment.id!, -1, undefined)"
                />
              </div>
            </div>
          </div>
          <CommentInput
            :focus="true"
            @submit="() => submit(selectedComment?.id)"
            v-model:input="input"
            class="pb-3"
            :placeholder="`回复 ${selectedComment.user?.nickname}`"
          />
        </div>

        <div class="max-h-96 overflow-y-auto py-5" ref="containerRef">
          <div class="py-1" v-for="reply in comments" :key="reply.id">
            <User
              :user="reply.user"
              v-if="reply.replyId === reply.replyParentsId"
            />
            <UserReply
              :user="reply.user"
              :reply-user="reply.replyUser"
              v-else
            />
            <div class="ml-10 py-1">
              <span>{{ reply.content }}</span>
              <div class="flex items-center justify-between pt-1">
                <span class="text-secondary-foreground">{{
                  dateStr(reply.createdAt!)
                }}</span>
                <CommentOperate
                  :comment="reply"
                  @delete="deleteComment"
                  @toggle-comment="toggleCommentInput"
                  @like="like"
                />
              </div>
            </div>
            <CommentInput
              :focus="true"
              v-if="activeCommentId === reply.id"
              @submit="() => submit(reply.id, reply.replyParentsId)"
              v-model:input="replyInput"
              class="pb-3"
              :placeholder="`回复 ${reply.user?.nickname}`"
            />
          </div>
          <div v-if="loading" class="py-5 text-center">
            <Skeleton active avatar :paragraph="{ rows: 3 }" />
          </div>
        </div>
      </div>
    </div>
  </Modal>
</template>

<style scoped>
.moreReply {
  background-color: #eeeff2;
  color: #8491a5;
}

.dark .moreReply {
  background-color: #252830;
  color: #a5b1c2;
}
</style>
