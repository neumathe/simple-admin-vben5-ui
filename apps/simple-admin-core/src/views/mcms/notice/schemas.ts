import type { VxeGridProps } from '#/adapter/vxe-table';

import { h } from 'vue';

import { type VbenFormProps } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { Switch, Tag } from 'ant-design-vue';

import { updateMcmsNotice } from '#/api/mcms/mcmsNotice';

const typeMap = {
  1: $t('mcms.noticeType.innerPage'),
  2: $t('mcms.noticeType.dialog'),
  3: $t('mcms.noticeType.rightTop'),
};

export const tableColumns: VxeGridProps = {
  columns: [
    {
      type: 'checkbox',
      width: 60,
    },

    {
      title: $t('mcms.mcmsNotice.title'),
      field: 'title',
    },
    {
      title: $t('mcms.mcmsNotice.content'),
      field: 'content',
    },
    {
      title: $t('mcms.mcmsNotice.type'),
      field: 'type',
      formatter: ({ cellValue }: { cellValue: keyof typeof typeMap }) => {
        return typeMap[cellValue] || '-';
      },
    },
    {
      title: $t('mcms.mcmsNotice.duration'),
      field: 'duration',
    },
    {
      title: $t('mcms.mcmsNotice.once'),
      field: 'once',
      slots: {
        default: (record) => {
          let resultText = '';
          resultText = record.row.isDefault
            ? $t('common.yes')
            : $t('common.no');
          return h(
            Tag,
            {
              color: record.row.isDefault ? 'green' : 'red',
            },
            () => resultText,
          );
        },
      },
    },
    {
      title: $t('mcms.mcmsNotice.reference'),
      field: 'reference',
    },
    {
      title: $t('common.status'),
      field: 'status',
      slots: {
        default: (e) =>
          h(Switch, {
            checked: e.row.status === 1,
            onClick: () => {
              const newStatus = e.row.status === 1 ? 2 : 1;
              updateMcmsNotice({ id: e.row.id, status: newStatus }).then(() => {
                e.row.status = newStatus;
              });
            },
          }),
      },
    },

    {
      title: $t('common.createTime'),
      field: 'createdAt',
      formatter: 'formatDateTime',
    },
  ],
};

export const searchFormSchemas: VbenFormProps = {
  schema: [
    {
      fieldName: 'title',
      label: $t('mcms.mcmsNotice.title'),
      component: 'Input',
    },
    {
      fieldName: 'content',
      label: $t('mcms.mcmsNotice.content'),
      component: 'Input',
    },
    {
      fieldName: 'reference',
      label: $t('mcms.mcmsNotice.reference'),
      component: 'Input',
    },
  ],
};

export const dataFormSchemas: VbenFormProps = {
  schema: [
    {
      fieldName: 'id',
      label: 'ID',
      component: 'Input',
      dependencies: {
        show: false,
        triggerFields: ['id'],
      },
    },
    {
      fieldName: 'title',
      label: $t('mcms.mcmsNotice.title'),
      component: 'Input',
    },
    {
      fieldName: 'content',
      label: $t('mcms.mcmsNotice.content'),
      component: 'Textarea',
    },
    {
      fieldName: 'type',
      label: $t('mcms.mcmsNotice.type'),
      component: 'Select',
      componentProps: {
        options: [
          { label: $t('mcms.noticeType.innerPage'), value: 1 },
          { label: $t('mcms.noticeType.dialog'), value: 2 },
          { label: $t('mcms.noticeType.rightTop'), value: 3 },
        ],
        dropdownMatchSelectWidth: 200,
      },
    },
    {
      fieldName: 'duration',
      label: $t('mcms.mcmsNotice.duration'),
      component: 'InputNumber',
    },
    {
      fieldName: 'once',
      label: $t('mcms.mcmsNotice.once'),
      component: 'RadioButtonGroup',
      defaultValue: 1,
      componentProps: {
        options: [
          { label: $t('common.yes'), value: 1 },
          { label: $t('common.no'), value: 0 },
        ],
      },
    },
    {
      fieldName: 'reference',
      label: $t('mcms.mcmsNotice.reference'),
      component: 'Input',
    },
    {
      fieldName: 'status',
      label: $t('mcms.mcmsNotice.status'),
      component: 'RadioButtonGroup',
      defaultValue: 1,
      componentProps: {
        options: [
          { label: $t('common.on'), value: 1 },
          { label: $t('common.off'), value: 2 },
        ],
      },
    },
  ],
};
