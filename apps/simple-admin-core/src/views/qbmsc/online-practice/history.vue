<script setup lang="ts">
import type { VxeGridListeners, VxeGridProps } from '#/adapter/vxe-table';
import type { PsOnlinePracticeInfo } from '#/api/qbms/model/psOnlinePracticeModel';
import type { PsSubjectInfo } from '#/api/qbms/model/psSubjectModel';
import type { ActionItem } from '#/components/table/table-action';
import type { VbenFormProps } from '@vben/common-ui';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  deletePsOnlinePractice,
  getPsOnlinePracticeList,
} from '#/api/qbms/psOnlinePractice';
import { getPsSubjectList } from '#/api/qbms/psSubject';
import { ExportPDFModal } from '#/components/outputPDF';
import { TableAction } from '#/components/table/table-action';
import { Page } from '@vben/common-ui';
import { $t } from '@vben/locales';
import { Tag } from 'ant-design-vue';
import { h, ref } from 'vue';
import { useRouter } from 'vue-router';

defineOptions({
  name: 'SequentialPractice',
});

const exportModalVisible = ref(false);
const selectedRowId = ref<number>(0);

const showExportModal = (id: number) => {
  selectedRowId.value = id;
  exportModalVisible.value = true;
};

const closeExportModal = () => {
  exportModalVisible.value = false;
};

const router = useRouter();

const subjects = ref([] as PsSubjectInfo[]);
const tableColumns: VxeGridProps = {
  columns: [
    {
      title: '科目',
      field: 'subject',
      formatter: ({ row }) => {
        const subject = subjects.value?.find(
          (s: PsSubjectInfo) => s.id === row.subject,
        );
        return subject?.name || '';
      },
      minWidth: 100,
    },
    {
      title: '模式',
      field: 'type',
      slots: { default: 'type' },
      minWidth: 100,
    },
    {
      title: $t('common.createTime'),
      field: 'createdAt',
      formatter: 'formatDateTime',
      minWidth: 160,
    },
    {
      title: '提交时间',
      field: 'submitedAt',
      formatter: 'formatDateTime',
      minWidth: 160,
    },
    {
      title: '得分',
      field: 'score',
      formatter: ({ cellValue, row }) =>
        row.submitedAt === null ? '-' : cellValue,
      minWidth: 80,
    },
    {
      title: '用时',
      field: 'timeUsed',
      formatter: ({ cellValue }) => {
        if (cellValue < 60) {
          return `${cellValue}s`;
        }
        if (cellValue < 3600) {
          return `${Math.floor(cellValue / 60)}m${cellValue % 60}s`;
        }
        return `${Math.floor(cellValue / 3600)}h${Math.floor((cellValue % 3600) / 60)}min`;
      },
      minWidth: 80,
    },
  ],
};

const searchFormSchemas: VbenFormProps = {
  schema: [
    {
      fieldName: 'subject',
      label: '科目',
      component: 'ApiSelect',
      componentProps: {
        allowClear: true,
        api: getPsSubjectList,
        params: {},
        resultField: 'data.data',
        labelField: 'name',
        valueField: 'id',
        multiple: false,
      },
    },
  ],
};

const formOptions: VbenFormProps = {
  // 默认展开
  collapsed: false,
  schema: [...(searchFormSchemas.schema as any)],
  // 控制表单是否显示折叠按钮
  showCollapseButton: false,
  // 按下回车时是否提交表单
  submitOnEnter: true,
};

const gridOptions: VxeGridProps<PsOnlinePracticeInfo> = {
  checkboxConfig: {
    highlight: true,
  },
  toolbarConfig: {
    slots: {
      buttons: 'toolbar-buttons',
    },
  },
  columns: [
    ...(tableColumns.columns as any),
    {
      title: $t('common.action'),
      fixed: 'right',
      field: 'action',
      minWidth: 120,
      slots: {
        default: ({ row }) =>
          h(TableAction, {
            actions: [
              row.submitedAt === null
                ? {
                    type: 'link',
                    icon: 'carbon:continue',
                    tooltip: '继续',
                    onClick: () => {
                      router.push(`/qbmsc/online-practice/${row.id}`);
                    },
                  }
                : {
                    type: 'link',
                    icon: 'ant-design:eye-outlined',
                    tooltip: '回看',
                    onClick: () => {
                      router.push(`/qbmsc/online-practice/${row.id}`);
                    },
                  },
              {
                icon: 'ant-design:file-pdf-outlined',
                type: 'link',
                tooltip: '导出PDF',
                onClick: () => {
                  showExportModal(row.id!);
                },
              },
              {
                icon: 'ant-design:delete-outlined',
                type: 'link',
                color: 'error',
                tooltip: $t('common.delete'),
                popConfirm: {
                  title: $t('common.deleteConfirm'),
                  placement: 'left',
                  confirm:
                    row.id === undefined
                      ? undefined
                      : deletePractice.bind(null, row.id),
                },
              },
            ] as ActionItem[],
          }),
      },
    },
  ],
  height: 'auto',
  keepSource: true,
  pagerConfig: {
    autoHidden: true,
    pageSizes: [5, 10, 20, 40],
    pageSize: 10,
  },
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        if (subjects.value.length === 0) {
          await getPsSubjectList().then((res) => {
            subjects.value = res.data.data;
          });
        }
        const res = await getPsOnlinePracticeList({
          page: page.currentPage,
          pageSize: page.pageSize,
          ...formValues,
        });
        return res.data;
      },
    },
  },
};

const showDeleteButton = ref<boolean>(false);

const gridEvents: VxeGridListeners<any> = {
  checkboxChange(e) {
    showDeleteButton.value = e.$table.getCheckboxRecords().length > 0;
  },
  checkboxAll(e) {
    showDeleteButton.value = e.$table.getCheckboxRecords().length > 0;
  },
};

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions,
  gridOptions,
  gridEvents,
});

async function deletePractice(id: number) {
  const result = await deletePsOnlinePractice({
    id,
  });
  if (result.code === 0) {
    await gridApi.reload();
  }
}
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #type="{ row }">
        <Tag v-if="row.type === 1" color="blue">随机</Tag>
        <Tag v-if="row.type === 2" color="purple">全部</Tag>
        <Tag v-if="row.type === 3" color="orange">复习</Tag>
        <Tag v-if="row.type === 4" color="green">智能</Tag>
        <Tag v-if="row.type === 5" color="cyan">错题本</Tag>
      </template>
      <template #toolbar-buttons> </template>

      <template #toolbar-tools> </template>
    </Grid>
    <ExportPDFModal
      v-model:open="exportModalVisible"
      :id="selectedRowId"
      @close="closeExportModal"
      source="op"
    />
  </Page>
</template>
