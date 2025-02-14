import type {
  BaseDataResp,
  BaseListReq,
  BaseResp,
  BaseUUIDReq,
  BaseUUIDsReq,
} from '#/api/model/baseModel';

import type {
  McmsBannerInfo,
  McmsBannerListResp,
} from './model/mcmsBannerModel';

import { requestClient } from '#/api/request';

enum Api {
  CreateMcmsBanner = '/sys-api/mcms_banner/create',
  DeleteMcmsBanner = '/sys-api/mcms_banner/delete',
  GetMcmsBannerById = '/sys-api/mcms_banner',
  GetMcmsBannerList = '/sys-api/mcms_banner/list',
  UpdateMcmsBanner = '/sys-api/mcms_banner/update',
}

/**
 * @description: Get mcms banner list
 */

export const getMcmsBannerList = (params: BaseListReq) => {
  return requestClient.post<BaseDataResp<McmsBannerListResp>>(
    Api.GetMcmsBannerList,
    params,
  );
};

/**
 *  @description: Create a new mcms banner
 */
export const createMcmsBanner = (params: McmsBannerInfo) => {
  return requestClient.post<BaseResp>(Api.CreateMcmsBanner, params);
};

/**
 *  @description: Update the mcms banner
 */
export const updateMcmsBanner = (params: McmsBannerInfo) => {
  return requestClient.post<BaseResp>(Api.UpdateMcmsBanner, params);
};

/**
 *  @description: Delete mcms banners
 */
export const deleteMcmsBanner = (params: BaseUUIDsReq) => {
  return requestClient.post<BaseResp>(Api.DeleteMcmsBanner, params);
};

/**
 *  @description: Get mcms banner By ID
 */
export const getMcmsBannerById = (params: BaseUUIDReq) => {
  return requestClient.post<BaseDataResp<McmsBannerInfo>>(
    Api.GetMcmsBannerById,
    params,
  );
};
