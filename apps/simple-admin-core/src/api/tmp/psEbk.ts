import { type BaseDataResp, type BaseListReq, type BaseResp, type BaseIDsReq, type BaseIDReq } from '#/api/model/baseModel';
import { requestClient } from '#/api/request';
import { type PsEbkInfo, type PsEbkListResp } from './model/psEbkModel';

enum Api {
  CreatePsEbk = '/qbms/ps_ebk/create',
  UpdatePsEbk = '/qbms/ps_ebk/update',
  GetPsEbkList = '/qbms/ps_ebk/list',
  DeletePsEbk = '/qbms/ps_ebk/delete',
  GetPsEbkById = '/qbms/ps_ebk',
}

/**
 * @description: Get ps ebk list
 */

export const getPsEbkList = (params: BaseListReq) => {
  return requestClient.post<BaseDataResp<PsEbkListResp>>(Api.GetPsEbkList, params);
};

/**
 *  @description: Create a new ps ebk
 */
export const createPsEbk = (params: PsEbkInfo) => {
  return requestClient.post<BaseResp>(Api.CreatePsEbk, params);
};

/**
 *  @description: Update the ps ebk
 */
export const updatePsEbk = (params: PsEbkInfo) => {
  return requestClient.post<BaseResp>(Api.UpdatePsEbk, params);
};

/**
 *  @description: Delete ps ebks
 */
export const deletePsEbk = (params: BaseIDsReq) => {
  return requestClient.post<BaseResp>(Api.DeletePsEbk, params);
};

/**
 *  @description: Get ps ebk By ID
 */
export const getPsEbkById = (params: BaseIDReq) => {
  return requestClient.post<BaseDataResp<PsEbkInfo>>(Api.GetPsEbkById, params);
};
