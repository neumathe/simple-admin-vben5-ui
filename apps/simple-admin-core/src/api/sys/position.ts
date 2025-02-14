import type {
  BaseDataResp,
  BaseIDReq,
  BaseIDsReq,
  BaseListReq,
  BaseResp,
} from '#/api/model/baseModel';

import type { PositionInfo, PositionListResp } from './model/positionModel';

import { requestClient } from '#/api/request';

enum Api {
  CreatePosition = '/sys-api/position/create',
  DeletePosition = '/sys-api/position/delete',
  GetPositionById = '/sys-api/position',
  GetPositionList = '/sys-api/position/list',
  UpdatePosition = '/sys-api/position/update',
}

/**
 * @description: Get position list
 */

export const getPositionList = (params: BaseListReq) => {
  return requestClient.post<BaseDataResp<PositionListResp>>(
    Api.GetPositionList,
    params,
  );
};

/**
 *  @description: Create a new position
 */
export const createPosition = (params: PositionInfo) => {
  return requestClient.post<BaseResp>(Api.CreatePosition, params);
};

/**
 *  @description: Update the position
 */
export const updatePosition = (params: PositionInfo) => {
  return requestClient.post<BaseResp>(Api.UpdatePosition, params);
};

/**
 *  @description: Delete positions
 */
export const deletePosition = (params: BaseIDsReq) => {
  return requestClient.post<BaseResp>(Api.DeletePosition, params);
};

/**
 *  @description: Get position By ID
 */
export const getPositionById = (params: BaseIDReq) => {
  return requestClient.post<BaseDataResp<PositionInfo>>(
    Api.GetPositionById,
    params,
  );
};
