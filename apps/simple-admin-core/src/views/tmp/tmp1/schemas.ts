import type { VxeGridProps } from '#/adapter/vxe-table';

import { h } from 'vue';

import { type VbenFormProps } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { z } from '#/adapter/form';

export const tableColumns: VxeGridProps = {
  columns: [
    {
      type: 'checkbox',
      width: 60,
    },

    {
      title: $t('tmp.communityNote.subject'),
      field: 'subject',
    },
    {
      title: $t('tmp.communityNote.question'),
      field: 'question',
    },
    {
      title: $t('tmp.communityNote.content'),
      field: 'content',
    },
    {
      title: $t('tmp.communityNote.createdBy'),
      field: 'createdBy',
    },
    {
      title: $t('tmp.communityNote.like'),
      field: 'like',
    },
    {
      title: $t('tmp.communityNote.dislike'),
      field: 'dislike',
    },
    {
      title: $t('tmp.communityNote.deletedBy'),
      field: 'deletedBy',
    },
    {
      title: $t('tmp.communityNote.published'),
      field: 'published',
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
      fieldName: 'content',
      label: $t('tmp.communityNote.content'),
      component: 'Input',
    },
    {
      fieldName: 'createdBy',
      label: $t('tmp.communityNote.createdBy'),
      component: 'Input',
    },
    {
      fieldName: 'deletedBy',
      label: $t('tmp.communityNote.deletedBy'),
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
      fieldName: 'subject',
      label: $t('tmp.communityNote.subject'),
      component: 'InputNumber',
    },
    {
      fieldName: 'question',
      label: $t('tmp.communityNote.question'),
      component: 'InputNumber',
    },
    {
      fieldName: 'content',
      label: $t('tmp.communityNote.content'),
      component: 'Input',
    },
    {
      fieldName: 'createdBy',
      label: $t('tmp.communityNote.createdBy'),
      component: 'Input',
    },
    {
      fieldName: 'like',
      label: $t('tmp.communityNote.like'),
      component: 'InputNumber',
    },
    {
      fieldName: 'dislike',
      label: $t('tmp.communityNote.dislike'),
      component: 'InputNumber',
    },
    {
      fieldName: 'deletedBy',
      label: $t('tmp.communityNote.deletedBy'),
      component: 'Input',
    },
    {
      fieldName: 'published',
      label: $t('tmp.communityNote.published'),
      component: 'RadioButtonGroup',
      defaultValue: true,
      componentProps: {
        options: [
          { label: $t('common.on'), value: true },
          { label: $t('common.off'), value: false },
        ],
      },
    },
  ],
};
