import type {
  BaseDataResp,
  BaseIDReq,
  BaseIDsReq,
  BaseListReq,
  BaseResp,
} from '#/api/model/baseModel';

import type { PsSubjectInfo, PsSubjectListResp } from './model/psSubjectModel';

import { requestClient } from '#/api/request';

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

export const getPsSubjectList = async (params?: BaseListReq) => {
  const cacheKey = `psSubjectList_${JSON.stringify(params)}`;
  const cachedData = localStorage.getItem(cacheKey);

  if (cachedData) {
    try {
      const { timestamp, data } = JSON.parse(cachedData);
      const isExpired = Date.now() - timestamp > 1 * 60 * 1000; // 1分钟过期

      if (!isExpired) {
        return data; // 直接返回缓存数据
      }
    } catch (error) {
      console.error('Failed to parse cache data:', error);
      localStorage.removeItem(cacheKey); // 解析失败时清除缓存
    }
  }

  try {
    const response = await requestClient.post<BaseDataResp<PsSubjectListResp>>(
      Api.GetPsSubjectList,
      params,
    );

    localStorage.setItem(
      cacheKey,
      JSON.stringify({
        timestamp: Date.now(),
        data: response, // 存储请求返回的数据
      }),
    );

    return response;
  } catch (error) {
    console.error('Failed to fetch PS subject list:', error);
    throw error;
  }
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
