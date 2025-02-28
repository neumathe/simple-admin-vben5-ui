import type {
  BaseDataResp,
  BaseListReq,
  BaseUUIDReq,
} from '#/api/model/baseModel';

import type { ListPdfTaskResp, PdfTaskInfo } from './model/ExportPDFTaskModel';

import { requestClient } from '#/api/request';

enum Api {
  GetExportPDFTaskByID = '/sys-api/pdflog',
  GetExportPDFTaskList = '/sys-api/pdflog/list',
}

export const getExportPDFTaskList = (params: BaseListReq) => {
  return requestClient.post<BaseDataResp<ListPdfTaskResp>>(
    Api.GetExportPDFTaskList,
    params,
  );
};

export const getExportPDFTaskById = (params: BaseUUIDReq) => {
  return requestClient.post<BaseDataResp<PdfTaskInfo>>(
    Api.GetExportPDFTaskByID,
    params,
  );
};
