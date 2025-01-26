import type { BaseListResp } from '#/api/model/baseModel';

import type { UserInfo } from '../../sys/model/userModel';

export interface NoteInfo {
  id?: number;
  createdAt?: number;
  updatedAt?: number;
  editedAt?: number;
  subject?: number;
  question?: number;
  content?: string;
  createdBy?: string;
  like?: number;
  dislike?: number;
  deletedBy?: string;
  published?: boolean;
  likeType?: number;
  user?: UserInfo;
}

export interface NoteListReq {
  subject?: number;
  question?: number;
  page?: number;
  pageSize?: number;
}

export interface likeNoteReq {
  id: number;
  likeType: number;
}

export type TokenListResp = BaseListResp<NoteInfo>;
