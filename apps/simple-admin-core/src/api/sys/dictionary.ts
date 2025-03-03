import type {
  BaseDataResp,
  BaseIDReq,
  BaseIDsReq,
  BaseListReq,
  BaseResp,
} from '#/api/model/baseModel';

import type {
  DictionaryInfo,
  DictionaryListResp,
} from './model/dictionaryModel';

import { requestClient } from '#/api/request';

enum Api {
  CreateDictionary = '/sys-api/dictionary/create',
  DeleteDictionary = '/sys-api/dictionary/delete',
  GetDictionaryById = '/sys-api/dictionary',
  GetDictionaryList = '/sys-api/dictionary/list',
  UpdateDictionary = '/sys-api/dictionary/update',
}

/**
 * @description: Get dictionary list
 */

export const getDictionaryList = (params: BaseListReq) => {
  return requestClient.post<BaseDataResp<DictionaryListResp>>(
    Api.GetDictionaryList,
    params,
  );
};

/**
 *  @description: Create a new dictionary
 */
export const createDictionary = (params: DictionaryInfo) => {
  return requestClient.post<BaseResp>(Api.CreateDictionary, params);
};

/**
 *  @description: Update the dictionary
 */
export const updateDictionary = (params: DictionaryInfo) => {
  return requestClient.post<BaseResp>(Api.UpdateDictionary, params);
};

/**
 *  @description: Delete dictionarys
 */
export const deleteDictionary = (params: BaseIDsReq) => {
  return requestClient.post<BaseResp>(Api.DeleteDictionary, params);
};

/**
 *  @description: Get dictionary By ID
 */
export const getDictionaryById = (params: BaseIDReq) => {
  return requestClient.post<BaseDataResp<DictionaryInfo>>(
    Api.GetDictionaryById,
    params,
  );
};
