<script setup lang="ts">
import type { NoteInfo } from '#/api/community/model/note';
import type { ExposeParam } from 'md-editor-v3';
import type { PropType } from 'vue';

import {
  createNote,
  deleteNoteC,
  likeNote,
  listMoreNote,
  updateNote,
} from '#/api/community/note';
import { uploadCloudFile } from '#/api/fms/cloudFile';
import { User } from '#/components/user';
import { dateStr } from '#/utils/time';
import Icon, {
  LoadingOutlined,
  LockOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
  SearchOutlined,
  UnlockOutlined,
} from '@ant-design/icons-vue';
import { Emoji, Mark } from '@vavt/v3-extension';
import { usePreferences } from '@vben/preferences';
import {
  Button,
  message,
  Modal,
  Pagination,
  Popconfirm,
  Spin,
} from 'ant-design-vue';
import { MdEditor, MdPreview } from 'md-editor-v3';
import { h, onMounted, reactive, ref, watch } from 'vue';

import { toolbars } from './staticConfig';

import 'md-editor-v3/lib/style.css';
import '@vavt/v3-extension/lib/asset/style.css';

const props = defineProps({
  note: {
    type: Object as PropType<NoteInfo>,
    default: null,
  },
  subject: {
    type: Number,
    required: true,
  },
  question: {
    type: Number,
    required: true,
  },
});

const indicator = h(LoadingOutlined, {
  style: {
    fontSize: '24px',
  },
  spin: true,
});

const state = reactive({
  text: '',
  modalVisible: false,
  modalFullscreen: false,
  toolbars,
  inputBoxWidth: '50%',
});

const Note = ref(props.note);

const id = `note-editor-p${props.question}`;
// const Note: NoteInfo = {
//   content: '## Hello World',
//   id: 1,
// };
const isEdit = ref(false);
const isMore = ref(false);
const isLoadingMore = ref(false);
const MoreNoteList = ref<NoteInfo[]>([]);
const MoreNoteTotal = ref(0);
const MoreNotePage = ref(1);
const { isDark, isMobile } = usePreferences();

const editorId = `note-editor${props.question}`;
const editorRef = ref<ExposeParam>();

const uploadImg = async (
  files: Array<File>,
  callback: (urls: string[]) => void,
) => {
  const res = await Promise.all(
    files.map((file) => {
      return new Promise((rev, rej) => {
        const form = new FormData();
        form.append('file', file);
        uploadCloudFile(file, '', [1])
          .then((res) => rev(res))
          .catch((error) => rej(error));
      });
    }),
  );

  callback(res.map((item: any) => item.data.url));
};

const changeLayout = () => {
  if (isMobile.value === true) {
    // 在移动端不现实分屏预览，要么编辑，要么仅预览
    state.toolbars = [
      'previewOnly',
      ...toolbars.filter(
        (item) => !(['preview', 'previewOnly'] as any).includes(item),
      ),
    ];
    state.inputBoxWidth = '100%';
    editorRef.value?.togglePreview(false);
  } else {
    state.toolbars = toolbars;
    state.inputBoxWidth = '50%';
    editorRef.value?.togglePreview(true);
  }
};

onMounted(() => {
  editorRef.value?.on('previewOnly', (v) => {
    if (isMobile.value === true && !v) {
      editorRef.value?.togglePreview(false);
    }
  });

  changeLayout();
  window.addEventListener('resize', changeLayout);
});

const showEditor = () => {
  state.text = Note.value?.content || '';
  isEdit.value = true;
  setTimeout(() => {
    if (isMobile.value === true) {
      editorRef.value?.togglePreview(false);
    }
  }, 100);
};

const showMore = () => {
  isMore.value = true;
  isLoadingMore.value = true;
  listMoreNote({
    question: props.question,
    subject: props.subject,
    page: MoreNotePage.value,
    pageSize: 10,
  })
    .then((res) => {
      if (res.code === 0) {
        MoreNoteList.value = res.data.data;
        MoreNoteTotal.value = res.data.total;
        isLoadingMore.value = false;
      }
    })
    .finally(() => {
      isLoadingMore.value = false;
    });
};

const onSave = () => {
  if (state.text === '') {
    message.error('笔记内容为空');
    return;
  }

  if (Note.value === null || Note.value.id === undefined) {
    createNote({
      content: state.text,
      question: props.question,
      subject: props.subject,
      published: Note.value?.published ?? true,
    }).then((res) => {
      if (res.code === 0) {
        message.success('保存成功');
        Note.value = res.data;
      }
    });
  } else {
    updateNote({
      content: state.text,
      id: Note.value.id,
      published: Note.value?.published,
    }).then((res) => {
      if (res.code === 0) {
        message.success('保存成功');
        Note.value = res.data;
      }
    });
  }
};

const deleteNote = () => {
  if (Note.value === null || Note.value.id === undefined) {
    return;
  }

  deleteNoteC({
    id: Note.value.id,
  }).then((res) => {
    if (res.code === 0) {
      message.success('删除成功');
      Note.value = {
        content: undefined,
        id: undefined,
        createdAt: undefined,
        editedAt: undefined,
        like: undefined,
        likeType: undefined,
        published: undefined,
        user: undefined,
      };
    }
  });
};

const like = (id: number, likeType: number) => {
  likeNote({
    id,
    likeType,
  }).then((res) => {
    if (res.code === 0) {
      for (const item of MoreNoteList.value) {
        if (item.id === id) {
          if (likeType === 1 && item.likeType !== 1) {
            if (item.like) {
              item.like += 1;
            } else {
              item.like = 1;
            }
          } else if (likeType !== 1 && item.likeType === 1 && item.like) {
            item.like -= 1;
          }
          item.likeType = likeType;
        }
      }
    }
  });
};

const changeIsPublished = () => {
  if (Note.value === null) {
    Note.value = { published: true };
  } else if (Note.value.published === null) {
    Note.value.published = true;
  } else {
    Note.value.published = !Note.value.published;
    if (Note.value.id) {
      updateNote({
        id: Note.value.id,
        published: Note.value.published,
      }).then((res) => {
        if (res.code === 0) {
          message.success('保存成功');
          Note.value = res.data;
        }
      });
    }
  }
};

watch(MoreNotePage, () => {
  isLoadingMore.value = true;
  MoreNoteList.value = [];
  listMoreNote({
    question: props.question,
    subject: props.subject,
    page: MoreNotePage.value,
    pageSize: 10,
  })
    .then((res) => {
      if (res.code === 0) {
        MoreNoteList.value = res.data.data;
        MoreNoteTotal.value = res.data.total;
        isLoadingMore.value = false;
      }
    })
    .finally(() => {
      isLoadingMore.value = false;
    });
});
</script>

<template>
  <div v-if="Note === null || Note.id === undefined">
    <div class="m-1 p-4">
      暂无笔记
      <div class="flex h-[100px] items-center justify-center space-x-4">
        <Button
          :icon="h(PlusOutlined)"
          class="flex items-center space-x-2"
          @click="showEditor"
        >
          创建笔记
        </Button>
        <span>或</span>
        <Button
          :icon="h(SearchOutlined)"
          class="flex items-center space-x-2"
          @click="showMore"
        >
          查看更多
        </Button>
      </div>
    </div>
  </div>
  <div v-else class="flex h-full flex-col">
    <MdPreview
      :editor-id="id"
      :model-value="Note.content"
      :theme="isDark ? 'dark' : 'light'"
    />
    <div
      class="text-secondary-foreground mt-auto flex flex-wrap items-center space-y-2 p-4 xl:space-y-0"
    >
      <!-- 左侧内容 -->
      <div class="flex flex-grow items-center space-x-2">
        <span
          v-if="
            Note.editedAt &&
            Note.editedAt > 0 &&
            Note.editedAt !== Note.createdAt
          "
        >
          编辑于：{{ dateStr(Note.editedAt) }}
        </span>
        <span v-else>发布于：{{ dateStr(Note.createdAt!) }}</span>
        <span>赞({{ Note.like }})</span>
      </div>

      <!-- 右侧按钮 -->
      <div class="flex w-full space-x-2 xl:w-auto xl:justify-end">
        <a class="flex items-center space-x-2" type="link" @click="showEditor">
          编辑
        </a>
        <Popconfirm
          cancel-text="取消"
          ok-text="确定"
          title="此操作将同时删除笔记下所有评论且不可恢复，确定删除笔记？"
          @confirm="deleteNote"
        >
          <template #icon>
            <QuestionCircleOutlined style="color: red" />
          </template>

          <a class="flex items-center space-x-2" href="#" type="link"> 删除 </a>
        </Popconfirm>

        <a class="flex items-center space-x-2" type="link" @click="showMore">
          更多笔记
        </a>
      </div>
    </div>
  </div>
  <Modal v-model:open="isEdit" :footer="null" title="编辑笔记" width="80%">
    <MdEditor
      :id="editorId"
      ref="editorRef"
      v-model="state.text"
      :footers="['markdownTotal', '=', 0, 'scrollSwitch']"
      :input-box-width="state.inputBoxWidth"
      :preview-theme="isDark ? 'dark' : 'light'"
      :theme="isDark ? 'dark' : 'light'"
      :toolbars="state.toolbars"
      auto-detect-code
      show-code-row-number
      @on-save="onSave"
      @on-upload-img="uploadImg"
    >
      <template #defToolbars>
        <Mark />
        <Emoji />
        <div
          class="md-editor-toolbar-item"
          title="是否公开"
          @click="changeIsPublished"
        >
          <Icon style="width: 16px; height: 16px; margin: 4px">
            <template #component>
              <LockOutlined v-if="Note && !!!Note.published" />
              <UnlockOutlined v-else />
            </template>
          </Icon>
        </div>
      </template>
    </MdEditor>
    <span style="color: hsl(var(--secondary-foreground))"></span>
  </Modal>
  <Modal v-model:open="isMore" :footer="null" title="更多笔记" width="80%">
    <Spin :indicator="indicator" :spinning="isLoadingMore">
      <div v-if="isLoadingMore" class="h-[400px] w-full"></div>
      <div v-if="MoreNoteList.length === 0 && !isLoadingMore">暂无笔记...</div>
      <div v-else>
        <div class="grid grid-cols-1 divide-y">
          <div v-for="n in MoreNoteList" :key="n.id" class="mt-4 pt-2">
            <User :user="n.user" />
            <MdPreview
              :editor-id="`more-previce${n.id}`"
              :model-value="n.content"
              :theme="isDark ? 'dark' : 'light'"
            />
            <div class="text-secondary-foreground">
              <span
                v-if="
                  n.editedAt && n.editedAt > 0 && n.editedAt !== n.createdAt
                "
              >
                编辑于： {{ dateStr(n.editedAt) }}
              </span>
              <span v-else>发布于： {{ dateStr(n.createdAt!) }}</span>
            </div>
            <div class="flex items-center space-x-2 pt-2">
              <!-- 赞同按钮 -->
              <button
                :class="
                  n.likeType === 1
                    ? 'bg-primary-500 hover:bg-primary-300 text-white'
                    : 'bg-primary-100 hover:bg-primary-300 text-primary-500'
                "
                aria-label="赞同"
                class="flex items-center rounded px-4 py-2 transition"
                type="button"
                @click="() => like(n.id!, n.likeType === 1 ? 0 : 1)"
              >
                <svg
                  class="mr-1 h-3 w-3"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    clip-rule="evenodd"
                    d="M13.792 3.681c-.781-1.406-2.803-1.406-3.584 0l-7.79 14.023c-.76 1.367.228 3.046 1.791 3.046h15.582c1.563 0 2.55-1.68 1.791-3.046l-7.79-14.023Z"
                    fill-rule="evenodd"
                  />
                </svg>
                <span v-if="n.likeType === 1">已</span>赞同 {{ n.like }}
              </button>

              <!-- 反对按钮 -->
              <button
                :class="
                  n.likeType === -1
                    ? 'bg-primary-400 hover:bg-primary-100 text-primary-700'
                    : 'bg-primary-100 hover:bg-primary-300 text-primary-500'
                "
                aria-label="反对"
                class="text-primary-500 flex items-center rounded px-2 py-[13px] transition hover:bg-gray-100"
                type="button"
                @click="() => like(n.id!, -1)"
              >
                <svg
                  class="mr-1 h-3 w-3"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    clip-rule="evenodd"
                    d="M13.792 20.319c-.781 1.406-2.803 1.406-3.584 0L2.418 6.296c-.76-1.367.228-3.046 1.791-3.046h15.582c1.563 0 2.55 1.68 1.791 3.046l-7.79 14.023Z"
                    fill-rule="evenodd"
                  />
                </svg>
              </button>

              <!-- 评论按钮 -->
              <button
                class="hover:text-primary-500 flex items-center rounded px-4 py-2 text-gray-600 transition hover:bg-gray-100"
                type="button"
              >
                <svg
                  class="mr-1 h-3 w-3"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    clip-rule="evenodd"
                    d="M12 2.75a9.25 9.25 0 1 0 4.737 17.197l2.643.817a1 1 0 0 0 1.25-1.25l-.8-2.588A9.25 9.25 0 0 0 12 2.75Z"
                    fill-rule="evenodd"
                  />
                </svg>
                1,270 条评论
              </button>
            </div>
          </div>
        </div>
        <div class="mt-4 flex justify-center">
          <Pagination
            v-model:current="MoreNotePage"
            :show-quick-jumper="false"
            :show-size-changer="false"
            :total="MoreNoteTotal"
          />
        </div>
      </div>
    </Spin>
  </Modal>
</template>

<style>
svg.md-editor-icon {
  display: block;
  width: 16px;
  height: 16px;
  padding: 0;
  margin: 4px;
  overflow: hidden;
  fill: none;
}

:root {
  --secondary-foreground: 220 5% 66% / 80%;
}

.dark,
.dark[data-theme='custom'],
.dark[data-theme='default'] {
  --secondary-foreground: 0deg 0% 80% / 50%;
}
</style>

<style scoped>
.cm-editor,
.md-editor-dark,
.md-editor-modal-container[data-theme='dark'] {
  --md-bk-color: #1c1e22;
  --md-color: var(--foreground);
}
</style>
