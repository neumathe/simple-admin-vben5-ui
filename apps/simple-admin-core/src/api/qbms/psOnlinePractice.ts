import {
  type BaseDataResp,
  type BaseIDReq,
  type BaseIDResp,
  type BaseIDsReq,
  type BaseListReq,
  type BaseResp,
} from '#/api/model/baseModel';
import { requestClient } from '#/api/request';

import {
  type CreateOnlinePracticeReq,
  type PsOnlinePracticeInfo,
  type PsOnlinePracticeListResp,
  type SubmitPracticeReq,
  type SubmitPracticeResp,
} from './model/psOnlinePracticeModel';

enum Api {
  CreatePsOnlinePractice = '/question-api/online_practice/create',
  DeletePsOnlinePractice = '/question-api/online_practice/delete',
  GetPsOnlinePracticeById = '/question-api/online_practice',
  GetPsOnlinePracticeList = '/question-api/online_practice/list',
  SubmitPractice = '/question-api/online_practice/submit',
}

/**
 * @description: Get ps online practice list
 */

export const getPsOnlinePracticeList = (params: BaseListReq) => {
  return requestClient.post<BaseDataResp<PsOnlinePracticeListResp>>(
    Api.GetPsOnlinePracticeList,
    params,
  );
};

/**
 *  @description: Create a new ps online practice
 */
export const createPsOnlinePractice = (params: CreateOnlinePracticeReq) => {
  return requestClient.post<BaseIDResp>(Api.CreatePsOnlinePractice, params);
};

/**
 *  @description: Update the ps online practice
 */
export const submitPractice = (params: SubmitPracticeReq) => {
  return requestClient.post<SubmitPracticeResp>(Api.SubmitPractice, params);
};

/**
 *  @description: Delete ps online practices
 */
export const deletePsOnlinePractice = (params: BaseIDsReq) => {
  return requestClient.post<BaseResp>(Api.DeletePsOnlinePractice, params);
};

/**
 *  @description: Get ps online practice By ID
 */
export const getPsOnlinePracticeById = (params: BaseIDReq) => {
  return requestClient.post<BaseDataResp<PsOnlinePracticeInfo>>(
    Api.GetPsOnlinePracticeById,
    params,
  );
};
