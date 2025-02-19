<script lang="ts" setup>
import type { PsEbkInfo } from '#/api/qbms/model/psEbkModel';

import { useVbenForm } from '#/adapter/form';
import { createPsEbk, updatePsEbk } from '#/api/qbms/psEbk';
import { useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';
import { message } from 'ant-design-vue';
import { ref } from 'vue';

import { dataFormSchemas } from './schemas';

defineOptions({
  name: 'PsEbkForm',
});

const record = ref();
const isUpdate = ref(false);
const gridApi = ref();

async function onSubmit(values: Record<string, any>) {
  const result = isUpdate.value
    ? await updatePsEbk(values as PsEbkInfo)
    : await createPsEbk(values as PsEbkInfo);
  if (result.code === 0) {
    message.success(result.msg);
    gridApi.value.reload();
  }
}

const [Form, formApi] = useVbenForm({
  handleSubmit: onSubmit,
  schema: [...(dataFormSchemas.schema as any)],
  showDefaultActions: false,
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
  },
  layout: 'horizontal',
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
        ? $t('qbms.psEbk.editPsEbk')
        : $t('qbms.psEbk.addPsEbk'),
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
