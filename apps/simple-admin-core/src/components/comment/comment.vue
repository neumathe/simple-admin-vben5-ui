<script setup lang="ts">
import type { CommentInfo } from '#/api/community/model/comment';
import type { PropType } from 'vue';

import {
  CreateComment,
  DeleteCommentC,
  LikeComment,
  ListComment,
} from '#/api/community/comment';
import { User, UserReply } from '#/components/user';
import { dateStr } from '#/utils/time';
import { RightOutlined } from '@ant-design/icons-vue';
import { useUserStore } from '@vben/stores';
import { message, Pagination } from 'ant-design-vue';
import { ref } from 'vue';

import CommentInput from './comment-input.vue';
import CommentModal from './comment-modal.vue';
import CommentOperate from './comment-operate.vue';

const props = defineProps({
  comments: {
    type: Object as PropType<CommentInfo[]>,
    default: null,
  },
  total: {
    type: Number,
    default: 0,
  },
  subject: {
    type: Number,
    required: true,
  },
  question: {
    type: Number,
    required: true,
  },
  note: {
    type: Number,
    default: null,
  },
});

const userStore = useUserStore();

const input = ref('');
const replyInput = ref('');
const isSubmiting = ref(false);
const comments = ref<CommentInfo[]>(props.comments ?? []);
const activeCommentId = ref<null | number>(null);
const page = ref(1);
const total = ref(props.total);
const showModal = ref(false);
const selectedComment = ref<CommentInfo | null>(null);

const openModal = (comment: CommentInfo) => {
  selectedComment.value = comment;
  showModal.value = true;
  replyInput.value = '';
  activeCommentId.value = 0;
};

const submit = (commentId?: number, replyParentsId?: number) => {
  if (commentId === undefined) {
    // 创建一条评论
    if (!input.value.trim()) {
      message.error('请输入内容');
      return;
    }
    isSubmiting.value = true;
    CreateComment({
      content: input.value,
      subject: props.subject,
      question: props.question,
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
            createdBy: userStore.userInfo?.userId,
          },
          ...comments.value,
        ];
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
    // 回复评论
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
        comments.value =
          replyParentsId === undefined
            ? comments.value.map((comment) => {
                if (comment.id !== commentId) return comment;
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
                  replyParentsId: commentId,
                  createdBy: userStore.userInfo?.userId,
                };
                comment.repliesCount
                  ? (comment.repliesCount = comment.repliesCount + 1)
                  : (comment.repliesCount = 1);
                return {
                  ...comment,
                  replies: [newReply, ...(comment.replies || [])],
                };
              })
            : comments.value.map((comment) => {
                if (comment.id !== replyParentsId) return comment;

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
                  replyParentsId: commentId,
                  createdBy: userStore.userInfo?.userId,
                };
                const originalReply = comment.replies?.find(
                  (r) => r.id === commentId,
                );
                newReply.replyUser = originalReply?.user;
                newReply.replyParentsId = originalReply?.replyParentsId;
                comment.repliesCount
                  ? (comment.repliesCount = comment.repliesCount + 1)
                  : (comment.repliesCount = 1);
                return {
                  ...comment,
                  replies: [newReply, ...(comment.replies || [])],
                };
              });

        replyInput.value = '';
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
  LikeComment({ id: commentId, likeType: type })
    .then(() => {
      comments.value = replyParentsId
        ? comments.value.map((comment) => {
            if (comment.id === replyParentsId) {
              comment.replies = comment.replies?.map((reply) => {
                if (reply.id === commentId) {
                  if (reply.like === undefined) {
                    reply.like = 0;
                  }
                  if (type !== 1 && reply.likeType === 1) {
                    reply.like -= 1;
                  } else if (type === 1 && reply.likeType !== 1) {
                    reply.like += 1;
                  }
                  reply.likeType = type;
                }
                return reply;
              });
            }
            return comment;
          })
        : comments.value.map((comment) => {
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
            }
            return comment;
          });
    })
    .catch(() => {
      message.error('点赞失败');
    });
};

const toggleCommentInput = (commentId: number) => {
  replyInput.value = '';
  activeCommentId.value =
    activeCommentId.value === commentId ? null : commentId;
};

const OnPage = (page: number) => {
  ListComment({
    subject: props.subject,
    question: props.question,
    page,
    pageSize: 5,
    noteId: props.note,
  })
    .then((res) => {
      comments.value = res.data.data;
      total.value = res.data.total;
    })
    .catch((error) => {
      console.error(error);
      message.error('获取评论失败');
    });
};

const deleteComment = (id: number, replyParentsId?: number) => {
  DeleteCommentC({ id })
    .then((res) => {
      if (res.code === 0) {
        message.success('已删除');

        comments.value =
          replyParentsId === undefined || replyParentsId === 0
            ? comments.value.filter((comment) => comment.id !== id)
            : comments.value.map((comment) => {
                if (comment.id === replyParentsId) {
                  comment.replies = comment.replies?.filter(
                    (reply) => reply.id !== id,
                  );
                }
                return comment;
              });
        comments.value = comments.value.map((comment) => {
          if (comment.id === replyParentsId) {
            comment.repliesCount = comment.repliesCount! - 1;
          }
          return comment;
        });

        if (replyParentsId === undefined || replyParentsId === 0) {
          OnPage(page.value);
        }
      }
    })
    .catch(() => {
      message.error('删除失败');
    });
};

// 在弹窗中发生回复/删除评论时，更新评论列表中的回复数
const ModalReliesCountChange = (id: number, count: number) => {
  comments.value = comments.value.map((comment) => {
    if (comment.id === id) {
      if (comment.repliesCount === undefined) {
        comment.repliesCount = count;
      } else {
        comment.repliesCount += count;
      }
    }
    return comment;
  });
};
</script>

<template>
  <div class="grid grid-cols-1 divide-y">
    <div v-for="comment in comments" :key="comment.id">
      <div class="pt-2">
        <User :user="comment.user" />
        <div class="ml-10 py-1">
          <span>{{ comment.content }}</span>
          <div class="flex items-center justify-between pt-1">
            <span class="text-secondary-foreground">{{
              dateStr(comment.createdAt!)
            }}</span>
            <CommentOperate
              :comment="comment"
              @delete="deleteComment"
              @toggle-comment="toggleCommentInput"
              @like="like"
            />
          </div>
        </div>
        <CommentInput
          :focus="true"
          v-if="activeCommentId === comment.id && !showModal"
          @submit="() => submit(comment.id)"
          v-model:input="replyInput"
          class="pb-3"
          :placeholder="`回复 ${comment.user?.nickname}`"
        />
      </div>
      <div class="ml-10 py-1" v-for="reply in comment.replies" :key="reply.id">
        <User
          :user="reply.user"
          v-if="reply.replyId === reply.replyParentsId"
        />
        <UserReply :user="reply.user" :reply-user="reply.replyUser" v-else />
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
          v-if="activeCommentId === reply.id && !showModal"
          @submit="() => submit(reply.id, reply.replyParentsId)"
          v-model:input="replyInput"
          class="pb-3"
          :placeholder="`回复 ${reply.user?.nickname}`"
        />
      </div>
      <button
        v-if="
          comment?.replies?.length &&
          comment?.replies?.length !== comment.repliesCount
        "
        @click="openModal(comment)"
        class="moreReply m-2 ml-10 rounded-md p-2 text-sm"
      >
        查看全部 {{ comment.repliesCount }} 条回复 <RightOutlined />
      </button>
    </div>

    <div>
      <CommentInput @submit="submit" v-model:input="input" class="py-3" />

      <Pagination
        size="small"
        :total="total"
        :page-size="5"
        v-model:current="page"
        class="p-2 text-center"
        v-if="total > 5"
        @change="OnPage"
        :show-quick-jumper="false"
        :show-size-changer="false"
      />
    </div>

    <CommentModal
      :comment="selectedComment!"
      :subject="props.subject"
      :question="props.question"
      :note="props.note"
      v-model:show-modal="showModal"
      @delete="deleteComment"
      @like="like"
      @modal-relies-count-change="ModalReliesCountChange"
    />
  </div>
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
