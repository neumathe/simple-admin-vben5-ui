import {
  type BaseDataResp,
  type BaseListReq,
  type BaseResp,
  type BaseIDsReq,
  type BaseIDReq,
} from '#/api/model/baseModel';
import { requestClient } from '#/api/request';
import {
  type CommunityNoteInfo,
  type CommunityNoteListResp,
} from './model/communityNoteModel';

enum Api {
  CreateCommunityNote = '/community/community_note/create',
  UpdateCommunityNote = '/community/community_note/update',
  GetCommunityNoteList = '/community/community_note/list',
  DeleteCommunityNote = '/community/community_note/delete',
  GetCommunityNoteById = '/community/community_note',
}

/**
 * @description: Get community note list
 */

export const getCommunityNoteList = (params: BaseListReq) => {
  return requestClient.post<BaseDataResp<CommunityNoteListResp>>(
    Api.GetCommunityNoteList,
    params,
  );
};

/**
 *  @description: Create a new community note
 */
export const createCommunityNote = (params: CommunityNoteInfo) => {
  return requestClient.post<BaseResp>(Api.CreateCommunityNote, params);
};

/**
 *  @description: Update the community note
 */
export const updateCommunityNote = (params: CommunityNoteInfo) => {
  return requestClient.post<BaseResp>(Api.UpdateCommunityNote, params);
};

/**
 *  @description: Delete community notes
 */
export const deleteCommunityNote = (params: BaseIDsReq) => {
  return requestClient.post<BaseResp>(Api.DeleteCommunityNote, params);
};

/**
 *  @description: Get community note By ID
 */
export const getCommunityNoteById = (params: BaseIDReq) => {
  return requestClient.post<BaseDataResp<CommunityNoteInfo>>(
    Api.GetCommunityNoteById,
    params,
  );
};
