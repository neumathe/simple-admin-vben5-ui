import type { BaseDataResp, BaseIDReq, BaseResp } from '../model/baseModel';
import type { NoteInfo } from './model/note';

import { requestClient } from '#/api/request';

enum Api {
  CreateNote = '/question-api/community_note/create',
  DeleteNote = '/question-api/community_note/delete',
  UpdateNote = '/question-api/community_note/update',
}

export function createNote(params: NoteInfo) {
  return requestClient.post<BaseDataResp<NoteInfo>>(Api.CreateNote, params);
}

export const deleteNote = (params: BaseIDReq) => {
  return requestClient.post<BaseResp>(Api.DeleteNote, params);
};

export const updateNote = (params: NoteInfo) => {
  return requestClient.post<BaseDataResp<NoteInfo>>(Api.UpdateNote, params);
};
