import type {
  BaseDataResp,
  BaseListReq,
  BaseResp,
  BaseUUIDReq,
  BaseUUIDsReq,
} from '#/api/model/baseModel';

import type {
  McmsNoticeInfo,
  McmsNoticeListResp,
} from './model/mcmsNoticeModel';

import { requestClient } from '#/api/request';

enum Api {
  CreateMcmsNotice = '/sys-api/mcms_notice/create',
  DeleteMcmsNotice = '/sys-api/mcms_notice/delete',
  GetMcmsNoticeById = '/sys-api/mcms_notice',
  GetMcmsNoticeList = '/sys-api/mcms_notice/list',
  UpdateMcmsNotice = '/sys-api/mcms_notice/update',
}

/**
 * @description: Get mcms notice list
 */

export const getMcmsNoticeList = (params: BaseListReq) => {
  return requestClient.post<BaseDataResp<McmsNoticeListResp>>(
    Api.GetMcmsNoticeList,
    params,
  );
};

/**
 *  @description: Create a new mcms notice
 */
export const createMcmsNotice = (params: McmsNoticeInfo) => {
  return requestClient.post<BaseResp>(Api.CreateMcmsNotice, params);
};

/**
 *  @description: Update the mcms notice
 */
export const updateMcmsNotice = (params: McmsNoticeInfo) => {
  return requestClient.post<BaseResp>(Api.UpdateMcmsNotice, params);
};

/**
 *  @description: Delete mcms notices
 */
export const deleteMcmsNotice = (params: BaseUUIDsReq) => {
  return requestClient.post<BaseResp>(Api.DeleteMcmsNotice, params);
};

/**
 *  @description: Get mcms notice By ID
 */
export const getMcmsNoticeById = (params: BaseUUIDReq) => {
  return requestClient.post<BaseDataResp<McmsNoticeInfo>>(
    Api.GetMcmsNoticeById,
    params,
  );
};
