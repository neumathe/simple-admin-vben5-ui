<script lang="ts" setup>
import type { CommunityNoteInfo } from '#/api/tmp/model/communityNoteModel';

import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import {
  createCommunityNote,
  updateCommunityNote,
} from '#/api/tmp/communityNote';

import { dataFormSchemas } from './schemas';

defineOptions({
  name: 'CommunityNoteForm',
});

const record = ref();
const isUpdate = ref(false);
const gridApi = ref();

async function onSubmit(values: Record<string, any>) {
  const result = isUpdate.value
    ? await updateCommunityNote(values as CommunityNoteInfo)
    : await createCommunityNote(values as CommunityNoteInfo);
  if (result.code === 0) {
    message.success(result.msg);
    gridApi.value.reload();
  }
}

const [Form, formApi] = useVbenForm({
  handleSubmit: onSubmit,
  schema: [...(dataFormSchemas.schema as any)],
  showDefaultActions: false,
  layout: 'vertical',
});

const [Modal, modalApi] = useVbenModal({
  fullscreenButton: false,
  onCancel() {
    modalApi.close();
  },
  onConfirm: async () => {
    await formApi.submitForm();
    modalApi.close();
  },
  onOpenChange(isOpen: boolean) {
    isUpdate.value = modalApi.getData()?.isUpdate;
    record.value = isOpen ? modalApi.getData()?.record || {} : {};
    gridApi.value = isOpen ? modalApi.getData()?.gridApi : null;
    if (isOpen) {
      formApi.setValues(record.value);
    }
    modalApi.setState({
      title: isUpdate.value
        ? $t('tmp.communityNote.editCommunityNote')
        : $t('tmp.communityNote.addCommunityNote'),
    });
  },
});

defineExpose(modalApi);
</script>
<template>
  <Modal>
    <Form />
  </Modal>
</template>
