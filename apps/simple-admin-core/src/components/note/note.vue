<script setup lang="ts">
import type { NoteInfo } from '#/api/community/model/note';
import type { ExposeParam } from 'md-editor-v3';
import type { PropType } from 'vue';

import { createNote, updateNote } from '#/api/community/note';
import { uploadCloudFile } from '#/api/fms/cloudFile';
import { dateStr } from '#/utils/time';
import Icon, {
  LockOutlined,
  PlusOutlined,
  SearchOutlined,
  UnlockOutlined,
} from '@ant-design/icons-vue';
import { Emoji, Mark } from '@vavt/v3-extension';
import { usePreferences } from '@vben/preferences';
import { Button, message, Modal } from 'ant-design-vue';
import { MdEditor, MdPreview } from 'md-editor-v3';
import { h, onMounted, reactive, ref } from 'vue';

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
      published: Note.value?.published,
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
</script>

<template>
  <div v-if="Note === null">
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
        <Button :icon="h(SearchOutlined)" class="flex items-center space-x-2">
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
      class="flex items-center justify-between space-x-2 p-4"
      style="margin-top: auto; color: hsl(var(--secondary-foreground))"
    >
      <!-- 左侧内容 -->
      <div>
        <span v-if="Note.updatedAt && Note.updatedAt !== Note.createdAt">
          编辑于： {{ dateStr(Note.updatedAt) }}
        </span>
        <span v-else>发布于： {{ dateStr(Note.createdAt!) }}</span>
        <span class="px-1"></span>
        <span> 赞({{ Note.like }}) </span>
      </div>

      <!-- 右侧按钮 -->
      <div class="flex space-x-2">
        <a class="flex items-center space-x-2" type="link" @click="showEditor">
          编辑
        </a>
        <a class="flex items-center space-x-2" type="link" @click="showEditor">
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
          @click="
            message.warn('切换公开状态后请点击保存');
            Note.published !== null
              ? (Note.published = !Note.published)
              : (Note.published = true);
          "
        >
          <Icon style="width: 16px; height: 16px; margin: 4px">
            <template #component>
              <LockOutlined v-if="!!!Note.published" />
              <UnlockOutlined v-else />
            </template>
          </Icon>
        </div>
      </template>
    </MdEditor>
    <span style="color: hsl(var(--secondary-foreground))"></span>
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
  --secondary-foreground: 240 6% 10%;
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
