import type {
  BaseDataResp,
  BaseIDReq,
  BaseIDsReq,
  BaseResp,
} from '../model/baseModel';
import type {
  likeNoteReq,
  ListNoteResp,
  NoteInfo,
  NoteListReq,
} from './model/note';

import { requestClient } from '#/api/request';

enum Api {
  CreateNote = '/question-api/community_note/create',
  DeleteNote = '/question-api/community_note/delete',
  likeNote = '/question-api/community_note/like',
  MoreNote = '/question-api/community_note/more',
  NoteBase = '/question-api/community_note',
  UpdateNote = '/question-api/community_note/update',
}

export function createNote(params: NoteInfo) {
  return requestClient.post<BaseDataResp<NoteInfo>>(Api.CreateNote, params);
}

export const deleteNoteB = (params: BaseIDsReq) => {
  return requestClient.post<BaseResp>(Api.DeleteNote, params);
};

export const deleteNoteC = (params: BaseIDReq) => {
  return requestClient.delete<BaseResp>(Api.NoteBase, params);
};

export const updateNote = (params: NoteInfo) => {
  return requestClient.post<BaseDataResp<NoteInfo>>(Api.UpdateNote, params);
};

export const listMoreNote = (params: NoteListReq) => {
  return requestClient.post<BaseDataResp<ListNoteResp>>(Api.MoreNote, params);
};

export const likeNote = (params: likeNoteReq) => {
  return requestClient.post<BaseResp>(Api.likeNote, params);
};
