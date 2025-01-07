import {
  type BaseDataResp,
  type BaseIDReq,
  type BaseIDsReq,
  type BaseListReq,
  type BaseResp,
} from '#/api/model/baseModel';
import { requestClient } from '#/api/request';

import {
  type PsSubjectInfo,
  type PsSubjectListResp,
} from './model/psSubjectModel';

enum Api {
  CreatePsSubject = '/question-api/ps_subject/create',
  DeletePsSubject = '/question-api/ps_subject/delete',
  GetPsSubjectById = '/question-api/ps_subject',
  GetPsSubjectList = '/question-api/ps_subject/list',
  UpdatePsSubject = '/question-api/ps_subject/update',
}

/**
 * @description: Get ps subject list
 */

export const getPsSubjectList = (params?: BaseListReq) => {
  return requestClient.post<BaseDataResp<PsSubjectListResp>>(
    Api.GetPsSubjectList,
    params,
  );
};

/**
 *  @description: Create a new ps subject
 */
export const createPsSubject = (params: PsSubjectInfo) => {
  return requestClient.post<BaseResp>(Api.CreatePsSubject, params);
};

/**
 *  @description: Update the ps subject
 */
export const updatePsSubject = (params: PsSubjectInfo) => {
  return requestClient.post<BaseResp>(Api.UpdatePsSubject, params);
};

/**
 *  @description: Delete ps subjects
 */
export const deletePsSubject = (params: BaseIDsReq) => {
  return requestClient.post<BaseResp>(Api.DeletePsSubject, params);
};

/**
 *  @description: Get ps subject By ID
 */
export const getPsSubjectById = (params: BaseIDReq) => {
  return requestClient.post<BaseDataResp<PsSubjectInfo>>(
    Api.GetPsSubjectById,
    params,
  );
};
