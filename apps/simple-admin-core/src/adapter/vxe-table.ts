import { setupVbenVxeTable, useVbenVxeGrid } from '@vben/plugins/vxe-table';
import { Button, Image } from 'ant-design-vue';
import { h } from 'vue';

import { useVbenForm } from './form';

setupVbenVxeTable({
  configVxeTable: (vxeUI) => {
    vxeUI.setConfig({
      grid: {
        align: 'center',
        border: false,
        columnConfig: {
          resizable: true,
        },
        minHeight: 180,
        formConfig: {
          // 全局禁用vxe-table的表单配置，使用formOptions
          enabled: false,
        },
        rowConfig: {
          isHover: true,
        },
        proxyConfig: {
          autoLoad: true,
          response: {
            result: 'data',
            total: 'total',
            list: 'data',
          },
          showActiveMsg: true,
          showResponseMsg: false,
        },
        round: true,
        showOverflow: true,
        size: 'small',
      },
    });

    // 表格配置项可以用 cellRender: { name: 'CellImage' },
    vxeUI.renderer.add('CellImage', {
      renderTableDefault(_renderOpts, params) {
        const { column, row } = params;
        return (row[column.field] as string).endsWith('png') ||
          (row[column.field] as string).endsWith('jpg') ||
          (row[column.field] as string).endsWith('jpeg') ||
          (row[column.field] as string).endsWith('svg')
          ? h(Image, { src: row[column.field] })
          : '';
      },
    });

    // 表格配置项可以用 cellRender: { name: 'CellLink' },
    vxeUI.renderer.add('CellLink', {
      renderTableDefault(renderOpts) {
        const { props } = renderOpts;
        return h(
          Button,
          { size: 'small', type: 'link' },
          { default: () => props?.text },
        );
      },
    });

    // 这里可以自行扩展 vxe-table 的全局配置，比如自定义格式化
    // vxeUI.formats.add
  },
  useVbenForm,
});

export { useVbenVxeGrid };

export type * from '@vben/plugins/vxe-table';
