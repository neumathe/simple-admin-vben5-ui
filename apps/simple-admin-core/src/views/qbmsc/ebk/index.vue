<script lang="ts" setup>
import type { VxeGridListeners, VxeGridProps } from '#/adapter/vxe-table';
import type { PsEbkInfo } from '#/api/qbms/model/psEbkModel';
import type { PsSubjectInfo } from '#/api/qbms/model/psSubjectModel';
import type { ActionItem } from '#/components/table/table-action';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { deletePsEbk, getPsEbkList } from '#/api/qbms/psEbk';
import { createPsOnlinePractice } from '#/api/qbms/psOnlinePractice';
import { getPsSubjectList } from '#/api/qbms/psSubject';
import { ExportPDFModal } from '#/components/outputPDF';
import { TableAction } from '#/components/table/table-action';
import { Page, useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';
import { Button, message, Tag } from 'ant-design-vue';
import { isPlainObject } from 'remeda';
import { h, ref } from 'vue';
import { useRouter } from 'vue-router';

import PsEbkForm from './form.vue';
import { tableColumns } from './schemas';

defineOptions({
  name: 'PsEbkManagement',
});

const router = useRouter();
// ---------------- form -----------------
const subjects = ref([] as PsSubjectInfo[]);

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: PsEbkForm,
});

const showDeleteButton = ref<boolean>(false);

const gridEvents: VxeGridListeners<any> = {
  checkboxChange(e) {
    showDeleteButton.value = e.$table.getCheckboxRecords().length > 0;
  },
  checkboxAll(e) {
    showDeleteButton.value = e.$table.getCheckboxRecords().length > 0;
  },
};

const exportModalVisible = ref(false);
const selectedRowId = ref<number>(0);

const showExportModal = (id: number) => {
  selectedRowId.value = id;
  exportModalVisible.value = true;
};

const closeExportModal = () => {
  exportModalVisible.value = false;
};

// const formOptions: VbenFormProps = {
//   // 默认展开
//   collapsed: false,
//   schema: [...(searchFormSchemas.schema as any)],
//   // 控制表单是否显示折叠按钮
//   showCollapseButton: true,
//   // 按下回车时是否提交表单
//   submitOnEnter: false,
// };

// ------------- table --------------------

const gridOptions: VxeGridProps<PsEbkInfo> = {
  checkboxConfig: {
    highlight: true,
  },
  toolbarConfig: {
    slots: {
      buttons: 'toolbar-buttons',
    },
  },
  columns: [
    {
      title: $t('qbms.psEbk.subject'),
      field: 'subject',
      formatter: ({ row }) => {
        const subject = subjects.value?.find(
          (s: PsSubjectInfo) => s.id === row.subject,
        );
        return subject?.name || '';
      },
      minWidth: 100,
    },
    ...(tableColumns.columns as any),
    {
      title: $t('common.action'),
      fixed: 'right',
      field: 'action',
      minWidth: 160,
      slots: {
        default: ({ row }) =>
          h(TableAction, {
            actions: [
              row.questionsCount &&
                row.questionsCount > 0 && {
                  type: 'link',
                  icon: 'ant-design:eye-outlined',
                  tooltip: '查看错题',
                  onClick: () => {
                    router.push(`/qbmsc/ebk/${row.subject}/${row.id}`);
                  },
                },
              row.questionsCount &&
                row.questionsCount > 0 && {
                  type: 'link',
                  icon: 'hugeicons:quiz-04',
                  tooltip: '进入模拟考试',
                  onClick: createOnlinePractice.bind(null, row),
                },
              row.questionsCount &&
                row.questionsCount > 0 && {
                  icon: 'ant-design:file-pdf-outlined',
                  type: 'link',
                  tooltip: '导出PDF',
                  onClick: () => {
                    showExportModal(row.id!);
                  },
                },
              {
                type: 'link',
                icon: 'clarity:note-edit-line',
                tooltip: $t('common.edit'),
                onClick: openFormModal.bind(null, row),
              },
              {
                icon: 'ant-design:delete-outlined',
                type: 'link',
                color: 'error',
                tooltip: $t('common.delete'),
                popConfirm: {
                  title: $t('common.deleteConfirm'),
                  placement: 'left',
                  confirm: deleteEbk.bind(null, row.id!),
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
    pageSizes: [10, 15, 20, 40],
    pageSize: 15,
  },
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        if (subjects.value.length === 0) {
          await getPsSubjectList().then((res) => {
            subjects.value = res.data.data;
          });
        }
        const res = await getPsEbkList({
          page: page.currentPage,
          pageSize: page.pageSize,
          ...formValues,
        });
        return res.data;
      },
    },
  },
};

const [Grid, gridApi] = useVbenVxeGrid({
  // formOptions,
  gridOptions,
  gridEvents,
});

function createOnlinePractice(record: any) {
  if (record.questionsCount === 0) {
    message.error('该错题本没有题目');
    return;
  }
  createPsOnlinePractice({
    subject: record.subject,
    ebkId: record.id,
    type: 5,
    count: 25,
    chapters: [],
  }).then((res) => {
    router.push(`/qbmsc/online-practice/${res.id}`);
  });
}

function openFormModal(record: any) {
  if (isPlainObject(record)) {
    formModalApi.setData({
      record,
      isUpdate: true,
      gridApi,
    });
  } else {
    formModalApi.setData({
      record: null,
      isUpdate: false,
      gridApi,
    });
  }
  formModalApi.open();
}

async function deleteEbk(id: number) {
  const result = await deletePsEbk({
    id,
  });
  if (result.code === 0) {
    await gridApi.reload();
    showDeleteButton.value = false;
  }
}
</script>

<template>
  <Page auto-content-height>
    <FormModal />
    <Grid>
      <template #defualt="{ row }">
        <Tag color="green" v-if="row.default === true">是</Tag>
        <Tag color="red" v-else>否</Tag>
      </template>

      <template #toolbar-tools>
        <Button type="primary" @click="openFormModal">
          {{ $t('qbms.psEbk.addPsEbk') }}
        </Button>
      </template>
      <template #toolbar-buttons></template>
    </Grid>
    <ExportPDFModal
      v-model:open="exportModalVisible"
      :id="selectedRowId"
      @close="closeExportModal"
      source="ebk"
    />
  </Page>
</template>
