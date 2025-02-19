import type { VxeGridProps } from '#/adapter/vxe-table';
import type { VbenFormProps } from '@vben/common-ui';

import { fetchAndTransformChapterList } from '#/api/qbms/psChapter';
import { getPsSubjectList } from '#/api/qbms/psSubject';
import { z } from '@vben/common-ui';
import { $t } from '@vben/locales';

export const tableColumns: VxeGridProps = {
  columns: [
    {
      title: $t('qbms.psEbk.name'),
      field: 'name',
    },
    {
      title: $t('qbms.psEbk.questionsCount'),
      field: 'questionsCount',
    },
    {
      title: $t('qbms.psEbk.default'),
      field: 'default',
      slots: { default: 'defualt' },
      width: 100,
    },
    {
      title: '创建时间',
      field: 'createdAt',
      formatter: 'formatDateTime',
    },
  ],
};

export const searchFormSchemas: VbenFormProps = {
  schema: [
    {
      fieldName: 'createdBy',
      label: $t('qbms.psEbk.createdBy'),
      component: 'Input',
    },
    {
      fieldName: 'name',
      label: $t('qbms.psEbk.name'),
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
      fieldName: 'name',
      label: $t('qbms.psEbk.name'),
      component: 'Input',
      rules: z
        .string()
        .min(1, { message: '请输入错题本名字' })
        .max(30, { message: '名字超长' }),
    },
    {
      fieldName: 'subject',
      label: $t('qbms.psEbk.subject'),
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
      rules: 'required',
      dependencies: {
        disabled(values) {
          return values.id > 0;
        },
        triggerFields: ['id'],
      },
    },
    {
      fieldName: 'default',
      label: $t('qbms.psEbk.default'),
      component: 'Switch',
      defaultValue: true,
      componentProps: {
        class: 'w-auto',
      },
      help: '您可以设置一组章节范围内的默认错题本，在添加对应章节范围内的题目到错题本的时候，会自动加入您设置的默认错题本',
    },
    {
      fieldName: 'chapters',
      label: '默认章节范围',
      component: 'ApiTreeSelect',
      componentProps: {
        multiple: true,
        allowClear: true,
        placeholder: '请选择',
        showSearch: true,
        treeNodeFilterProp: 'label',
        treeCheckable: true,
        treeDefaultExpandAll: true,
        fieldNames: { label: 'title', value: 'key', children: 'children' },
      },
      dependencies: {
        show(values) {
          return !!values.default;
        },
        required: (_value: any, _formApi: any) => {
          return true;
        },
        triggerFields: ['default', 'subject'],
        componentProps(values: any, _formApi: any) {
          return {
            multiple: true,
            allowClear: true,
            placeholder: '请选择',
            showSearch: true,
            treeNodeFilterProp: 'label',
            treeCheckable: true,
            treeDefaultExpandAll: true,
            fieldNames: { label: 'title', value: 'key', children: 'children' },
            needBuild: false,
            api: fetchAndTransformChapterList,
            params: { subjectId: values.subject },
          };
        },
      },
    },
  ],
};
