import type { VxeGridProps } from '#/adapter/vxe-table';
import type { VbenFormProps } from '@vben/common-ui';

import { z } from '#/adapter/form';
import { getDepartmentList } from '#/api/sys/department';
import { getPositionList } from '#/api/sys/position';
import { getRoleList } from '#/api/sys/role';
import { updateUser } from '#/api/sys/user';
import { $t } from '@vben/locales';
import { Switch } from 'ant-design-vue';
import { h } from 'vue';

export const tableColumns: VxeGridProps = {
  columns: [
    {
      type: 'checkbox',
      width: 60,
    },
    {
      title: $t('sys.user.nickname'),
      field: 'nickname',
    },
    {
      title: $t('sys.login.email'),
      field: 'email',
    },
    {
      title: $t('sys.login.mobile'),
      field: 'mobile',
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
              updateUser({ id: e.row.id, status: newStatus }).then(() => {
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
      fieldName: 'nickname',
      label: $t('sys.user.nickname'),
      component: 'Input',
    },
    {
      fieldName: 'roleIds',
      label: $t('sys.role.roleTitle'),
      component: 'ApiSelect',
      componentProps: {
        api: getRoleList,
        params: {
          page: 1,
          pageSize: 100,
        },
        resultField: 'data.data',
        labelField: 'trans',
        valueField: 'id',
        multiple: true,
      },
    },
    {
      fieldName: 'mobile',
      label: $t('sys.login.mobile'),
      component: 'Input',
    },
    {
      fieldName: 'email',
      label: $t('sys.login.email'),
      component: 'Input',
    },
    {
      fieldName: 'description',
      label: $t('sys.user.description'),
      component: 'Input',
    },
  ],
};
const phoneRegex = /^1[3-9]\d{9}$/;

export const dataFormSchemas: VbenFormProps = {
  schema: [
    {
      fieldName: 'avatar',
      label: $t('sys.user.avatar'),
      component: 'ImageUpload',
      componentProps: {
        accept: ['png', 'jpeg', 'jpg'],
        maxSize: 2,
        maxNumber: 1,
        multiple: false,
        provider: 'cloud-default',
      },
    },
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
      fieldName: 'nickname',
      label: $t('sys.user.nickname'),
      component: 'Input',
      rules: z.string().max(40),
    },
    {
      fieldName: 'description',
      label: $t('sys.user.description'),
      component: 'Input',
      rules: z.string().max(100).optional(),
    },
    {
      fieldName: 'homePath',
      label: $t('sys.user.homePath'),
      defaultValue: '/dashboard',
      component: 'Input',
      rules: z.string().max(70).optional(),
      help: $t('sys.role.defaultRouterHelpMessage'),
    },
    {
      label: $t('sys.login.mobile'),
      fieldName: 'mobile',
      component: 'Input',
      rules: z.string().regex(phoneRegex, '请输入有效的手机号码'),
    },
    {
      fieldName: 'email',
      label: $t('sys.login.email'),
      component: 'Input',
      rules: z.string().email(),
    },
    {
      fieldName: 'password',
      label: $t('sys.login.password'),
      component: 'Input',
      rules: z.string().min(6).max(100).optional(),
    },
    {
      fieldName: 'roleIds',
      label: $t('sys.role.roleTitle'),
      component: 'ApiSelect',
      componentProps: {
        api: getRoleList,
        params: {
          page: 1,
          pageSize: 100,
        },
        resultField: 'data.data',
        labelField: 'trans',
        valueField: 'id',
        multiple: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'departmentId',
      label: $t('sys.department.userDepartment'),
      component: 'ApiTreeSelect',
      componentProps: {
        api: getDepartmentList,
        params: {
          page: 1,
          pageSize: 1000,
        },
        resultField: 'data.data',
        labelField: 'trans',
        valueField: 'id',
      },
      rules: 'required',
    },
    {
      fieldName: 'positionId',
      label: $t('sys.position.userPosition'),
      component: 'ApiSelect',
      componentProps: {
        api: getPositionList,
        params: {
          page: 1,
          pageSize: 1000,
          name: '',
        },
        resultField: 'data.data',
        labelField: 'trans',
        valueField: 'id',
        multiple: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'status',
      label: $t('common.status'),
      component: 'RadioButtonGroup',
      defaultValue: 1,
      componentProps: {
        options: [
          { label: $t('common.on'), value: 1 },
          { label: $t('common.off'), value: 2 },
        ],
      },
      rules: 'required',
    },
  ],
};
