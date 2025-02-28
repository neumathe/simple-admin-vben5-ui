<script setup lang="ts">
import { getExportPDFTaskById } from '#/api/job/ExportPDFTask';
import { outPutPdfEbk } from '#/api/qbms/psEbk';
import { outPutPdfOnlinePractice } from '#/api/qbms/psOnlinePractice';
import {
  Button,
  Form,
  FormItem,
  message,
  Modal,
  Spin,
  Switch,
} from 'ant-design-vue';
import { defineProps, ref, watch } from 'vue';

interface ExportPdfModalProps {
  open: boolean;
  id: number;
  source: 'ebk' | 'op';
}

const props = defineProps<ExportPdfModalProps>();

const emit = defineEmits(['update:open']);
const form = ref();
const open = ref(props.open);
const loading = ref(false);
const includeAnalysis = ref(false);
const onlyCorrect = ref(false);
const highlightCorrect = ref(true);
const isHighlightDisabled = ref(false);
const status = ref<number>(0);
const progress = ref<number>(0);
const taskId = ref<string>('');
const downloadUrl = ref<string>('');

const statusTextMap: Record<number, string> = {
  1: '等待中',
  2: '进行中',
  3: '已完成',
  4: '失败',
  5: '已完成',
  6: '已归档',
};

let exportInterval: NodeJS.Timeout | null = null;

watch(
  () => props.open,
  (newVal) => {
    open.value = newVal;
    if (newVal) {
      // 重置所有状态
      includeAnalysis.value = false;
      onlyCorrect.value = false;
      highlightCorrect.value = true;
      isHighlightDisabled.value = false;
      status.value = 0;
      progress.value = 0;
      taskId.value = '';
      downloadUrl.value = '';
    }
  },
);

const handleOnlyCorrectChange = () => {
  // 当 OnlyCorrect 为 true 时，HighlightCorrect 只能是 false
  if (onlyCorrect.value) {
    highlightCorrect.value = false;
    isHighlightDisabled.value = true;
  } else {
    isHighlightDisabled.value = false;
  }
};

const checkExportStatus = async () => {
  if (exportInterval) clearInterval(exportInterval); // 防止重复开启定时器
  exportInterval = setInterval(async () => {
    const res = await getExportPDFTaskById({ id: taskId.value });
    status.value = res.data.status ?? 0;

    if (status.value !== 1 && status.value !== 2) {
      clearInterval(exportInterval!);
      exportInterval = null;

      if (status.value === 3 || status.value === 5) {
        message.success('导出完成');
        downloadUrl.value = res.data.downloadUrl!;
      } else {
        message.error('导出失败');
      }
      loading.value = false;
    }
  }, 5000);
};

const downloadPdf = async () => {
  try {
    const fullUrl = downloadUrl.value.startsWith('http')
      ? downloadUrl.value
      : `${window.location.protocol}//${downloadUrl.value}`;

    const response = await fetch(fullUrl);
    if (!response.ok) throw new Error(`下载失败: ${response.status}`);

    const blob = await response.blob();

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = `export_${taskId.value}.pdf`;

    document.body.append(a); // 确保 a 元素在 DOM 中
    a.click();
    a.remove(); // 清理 DOM

    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('下载失败', error);
    message.error('下载失败，请重试');
  }
};

const handleCancel = () => {
  open.value = false;
  emit('update:open', false);

  if (exportInterval) {
    clearInterval(exportInterval);
    exportInterval = null;
  }
};

const handleExport = async () => {
  loading.value = true;
  try {
    const exportData = {
      id: props.id,
      includeAnalysis: includeAnalysis.value,
      onlyCorrect: onlyCorrect.value,
      highlightCorrect: highlightCorrect.value,
    };
    if (props.source === 'ebk') {
      const res = await outPutPdfEbk(exportData);
      taskId.value = res.id;
    }
    if (props.source === 'op') {
      const res = await outPutPdfOnlinePractice(exportData);
      taskId.value = res.id;
    }
    message.success('导出任务已提交');
    message.success(
      '若等待时间过长，您可以先关闭当前页面，稍后在 右上角头像->我的PDF 页面查看结果',
    );
    await checkExportStatus();
  } catch {
    message.error('导出失败，请重试');
    loading.value = false;
  }
};
</script>

<template>
  <Modal
    v-model:open="open"
    title="导出PDF"
    @ok="handleExport"
    @cancel="handleCancel"
    @close="handleCancel"
    :confirm-loading="loading"
    :destroy-on-close="true"
  >
    <Form :form="form" layout="vertical" v-if="status === 0">
      <FormItem label="是否包含解析">
        <Switch v-model:checked="includeAnalysis" />
      </FormItem>
      <FormItem label="仅导出正确选项">
        <Switch
          v-model:checked="onlyCorrect"
          @change="handleOnlyCorrectChange"
        />
      </FormItem>
      <FormItem label="标记正确选项">
        <Switch
          v-model:checked="highlightCorrect"
          :disabled="isHighlightDisabled"
        />
      </FormItem>
    </Form>

    <!-- 显示导出状态 -->
    <Spin v-if="status === 1 || status === 2" tip="正在导出...">
      <p>状态: {{ statusTextMap[status] || '未知状态' }}</p>
    </Spin>

    <Button
      v-if="status === 3 || status === 5"
      type="primary"
      @click="downloadPdf"
    >
      下载PDF
    </Button>
  </Modal>
</template>
