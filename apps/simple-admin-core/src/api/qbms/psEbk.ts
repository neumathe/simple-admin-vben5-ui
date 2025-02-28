import type {
  BaseDataResp,
  BaseIDReq,
  BaseResp,
  BaseUUIDReq,
} from '#/api/model/baseModel';

import type {
  EbkDetail,
  ListEbkReq,
  OutPutPdfReq,
  PsEbkInfo,
  PsEbkListResp,
} from './model/psEbkModel';

import { requestClient } from '#/api/request';

enum Api {
  AddToEbk = '/question-api/ebk/add',
  CreatePsEbk = '/question-api/ebk/create',
  DeletePsEbk = '/question-api/ebk/delete',
  GetPsEbkById = '/question-api/ebk',
  GetPsEbkList = '/question-api/ebk/list',
  OutPutPdf = '/question-api/ebk/output_pdf',
  RemoveFromEbk = '/question-api/ebk/remove',
  UpdatePsEbk = '/question-api/ebk/update',
}

/**
 * @description: Get ps ebk list
 */

export const getPsEbkList = (params: ListEbkReq) => {
  return requestClient.post<BaseDataResp<PsEbkListResp>>(
    Api.GetPsEbkList,
    params,
  );
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
export const deletePsEbk = (params: BaseIDReq) => {
  return requestClient.post<BaseResp>(Api.DeletePsEbk, params);
};

/**
 *  @description: Get ps ebk By ID
 */
export const getPsEbkById = (params: BaseIDReq) => {
  return requestClient.post<BaseDataResp<PsEbkInfo>>(Api.GetPsEbkById, params);
};

export const addToEbk = (params: EbkDetail) => {
  return requestClient.post<BaseResp>(Api.AddToEbk, params);
};

export const removeFromEbk = (params: EbkDetail) => {
  return requestClient.post<BaseResp>(Api.RemoveFromEbk, params);
};

export const outPutPdfEbk = (params: OutPutPdfReq) => {
  return requestClient.post<BaseUUIDReq>(Api.OutPutPdf, params);
};
