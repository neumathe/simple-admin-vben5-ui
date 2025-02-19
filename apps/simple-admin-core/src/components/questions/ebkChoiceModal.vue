<script lang="ts" setup>
import type { PsEbkInfo } from '#/api/qbms/model/psEbkModel';

import { addToEbk, getPsEbkList } from '#/api/qbms/psEbk';
import { useVbenModal } from '@vben/common-ui';
import { message, Table } from 'ant-design-vue';
import { computed, ref } from 'vue';

const list = ref<PsEbkInfo[]>([]);
const data = ref();
const page = ref(1);
const total = ref(0);
const selectedRowKeys = ref<number[]>([]);
const [Modal, modalApi] = useVbenModal({
  onCancel() {
    selectedRowKeys.value = [];
    modalApi.close();
  },
  onConfirm() {
    if (selectedRowKeys.value.length === 0) {
      message.error('请选择一个错题本');
      return;
    }
    modalApi.setState({ loading: true });
    addToEbk({
      qustionId: data.value.question.id,
      ebkId: selectedRowKeys.value[0],
    })
      .then((res) => {
        if (res.code === 0) {
          message.success(res.msg);
          selectedRowKeys.value = [];
          modalApi.close();
        }
      })
      .finally(() => {
        modalApi.setState({ loading: false });
      });
  },
  onOpenChange(isOpen) {
    if (isOpen) {
      data.value = modalApi.getData();
      getEbks();
    }
  },
});

function getEbks() {
  selectedRowKeys.value = [];
  modalApi.setState({ loading: true });
  getPsEbkList({
    subject: data.value.subjectId,
    page: page.value,
    pageSize: 10,
  })
    .then((res) => {
      list.value = res.data.data;
      total.value = res.data.total;
      modalApi.setState({ loading: false });
    })
    .finally(() => {
      modalApi.setState({ loading: false });
    });
}

const conlumns = [
  {
    title: '名字',
    dataIndex: 'name',
  },
  {
    title: '题目总数',
    dataIndex: 'questionsCount',
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    customRender: ({
      text,
    }: {
      column: any;
      index: number;
      record: any;
      text: string;
    }) => {
      return new Date(text).toLocaleString();
    },
  },
];

const rowSelection = computed(() => {
  return {
    selectedRowKeys: selectedRowKeys.value,
    onChange: (keys: any) => {
      selectedRowKeys.value = keys;
    },
    type: 'radio' as 'radio',
  };
});

const selectRow = (record: any) => {
  selectedRowKeys.value = [record.id];
};

const customRow = (record: any) => {
  return {
    onClick: () => {
      selectRow(record);
    },
  };
};
</script>
<template>
  <Modal title="加入错题本">
    <div>
      <Table
        :data-source="list"
        :columns="conlumns"
        :row-selection="rowSelection"
        :custom-row="customRow"
        :row-key="(record) => record.id"
        @change="getEbks"
        :pagination="{
          current: page,
          total,
          pageSize: 10,
          showQuickJumper: false,
          showSizeChanger: false,
          onChange: (p) => {
            page = p;
            getEbks();
          },
        }"
      />
    </div>
  </Modal>
</template>
