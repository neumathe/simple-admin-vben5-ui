<script setup lang="ts">
import { getExportPDFTaskList } from '#/api/job/ExportPDFTask';
import {
  Button,
  message,
  Modal,
  Pagination,
  Spin,
  Table,
  Tag,
} from 'ant-design-vue';
import { defineProps, ref, watch } from 'vue';

interface ExportHistoryModalProps {
  open: boolean;
}

const props = defineProps<ExportHistoryModalProps>();
const emit = defineEmits(['update:open']);

const open = ref(props.open);
const loading = ref(false);
const historyList = ref<any[]>([]);
const total = ref(0);
const currentPage = ref(1);
const pageSize = 10;

const statusTextMap: Record<number, { color: string; text: string }> = {
  1: { text: '等待中', color: 'blue' },
  2: { text: '进行中', color: 'processing' },
  3: { text: '已完成', color: 'green' },
  4: { text: '失败', color: 'red' },
  5: { text: '已完成', color: 'green' },
  6: { text: '已归档', color: 'gray' },
};

const columns = [
  { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt' },
  { title: '题目总数', dataIndex: 'questionCount', key: 'questionCount' },
  { title: '状态', key: 'status' },
  { title: '操作', key: 'action' },
];

// 新增时间格式化函数
const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleString();
};

const fetchHistory = async () => {
  loading.value = true;
  try {
    const res = await getExportPDFTaskList({
      page: currentPage.value,
      pageSize,
    });
    historyList.value = res.data.data;
    total.value = res.data.total;
  } catch {
    message.error('获取导出记录失败，请重试');
  }
  loading.value = false;
};

watch(
  () => props.open,
  (newVal) => {
    open.value = newVal;
    historyList.value = [];
    if (newVal) {
      fetchHistory();
    }
  },
);

const handleCancel = () => {
  currentPage.value = 1;
  open.value = false;
  emit('update:open', false);
};

const downloadPdfByUrl = async (url: string, filename: string) => {
  try {
    // 修复协议处理，强制使用 HTTPS
    const fullUrl = url.startsWith('http') ? url : `https://${url}`;

    const response = await fetch(fullUrl);
    if (!response.ok) throw new Error(`下载失败: ${response.status}`);

    const blob = await response.blob();

    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = downloadUrl;
    a.download = filename;

    document.body.append(a);
    a.click();
    a.remove();

    window.URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error('下载失败', error);
    throw new Error('下载失败，请重试');
  }
};

// 修改为使用 fileName 作为文件名
const handleDownload = async (url: string, fileName: string) => {
  try {
    await downloadPdfByUrl(url, `${fileName}.pdf`);
    message.success('下载成功');
  } catch {
    message.error('下载失败，请重试');
  }
};
</script>

<template>
  <Modal
    v-model:open="open"
    title="导出历史记录"
    @cancel="handleCancel"
    @close="handleCancel"
    :destroy-on-close="true"
  >
    <template #footer> </template>
    <Spin :spinning="loading">
      <Table
        :columns="columns"
        :data-source="historyList"
        :pagination="false"
        row-key="id"
        bordered
      >
        <template #bodyCell="{ column, record }">
          <!-- 新增时间格式化显示 -->
          <template v-if="column.key === 'createdAt'">
            {{ formatDate(record.createdAt) }}
          </template>
          <template v-else-if="column.key === 'status'">
            <Tag :color="statusTextMap[record.status]?.color || 'default'">
              {{ statusTextMap[record.status]?.text || '未知状态' }}
            </Tag>
          </template>
          <template v-else-if="column.key === 'action'">
            <Button
              v-if="record.status === 3 || record.status === 5"
              type="link"
              @click="() => handleDownload(record.downloadUrl, record.fileName)"
            >
              下载
            </Button>
          </template>
        </template>
      </Table>
      <Pagination
        v-if="total > pageSize"
        :current="currentPage"
        :page-size="pageSize"
        :total="total"
        @change="
          (page) => {
            currentPage = page;
            fetchHistory();
          }
        "
        style="margin-top: 16px; text-align: right"
      />
    </Spin>
  </Modal>
</template>
