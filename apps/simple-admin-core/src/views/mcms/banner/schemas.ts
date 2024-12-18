import type { VxeGridProps } from '#/adapter/vxe-table';

import { h } from 'vue';

import { type VbenFormProps } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { Switch } from 'ant-design-vue';

import { updateMcmsBanner } from '#/api/mcms/mcmsBanner';

const typeMap = {
  1: $t('mcms.bannerType.web'),
  2: $t('mcms.bannerType.miniprogram'),
};

export const tableColumns: VxeGridProps = {
  columns: [
    {
      type: 'checkbox',
      width: 60,
    },

    {
      title: $t('mcms.mcmsBanner.image'),
      field: 'image',
    },
    {
      title: $t('mcms.mcmsBanner.type'),
      field: 'type',
      formatter: ({ cellValue }: { cellValue: keyof typeof typeMap }) => {
        return typeMap[cellValue] || '-';
      },
    },
    {
      title: $t('mcms.mcmsBanner.name'),
      field: 'name',
    },
    {
      title: $t('mcms.mcmsBanner.description'),
      field: 'description',
    },
    {
      title: $t('mcms.mcmsBanner.reference'),
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
              updateMcmsBanner({ id: e.row.id, status: newStatus }).then(() => {
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
      fieldName: 'image',
      label: $t('mcms.mcmsBanner.image'),
      component: 'Input',
    },
    {
      fieldName: 'name',
      label: $t('mcms.mcmsBanner.name'),
      component: 'Input',
    },
    {
      fieldName: 'description',
      label: $t('mcms.mcmsBanner.description'),
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
      fieldName: 'image',
      label: $t('mcms.mcmsBanner.image'),
      component: 'Input',
    },
    {
      fieldName: 'type',
      label: $t('mcms.mcmsBanner.type'),
      component: 'Select',
      componentProps: {
        options: [
          { label: $t('mcms.bannerType.web'), value: 1 },
          { label: $t('mcms.bannerType.miniprogram'), value: 2 },
        ],
      },
    },
    {
      fieldName: 'name',
      label: $t('mcms.mcmsBanner.name'),
      component: 'Input',
    },
    {
      fieldName: 'description',
      label: $t('mcms.mcmsBanner.description'),
      component: 'Input',
    },
    {
      fieldName: 'reference',
      label: $t('mcms.mcmsBanner.reference'),
      component: 'Input',
    },
    {
      fieldName: 'status',
      label: $t('mcms.mcmsBanner.status'),
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
