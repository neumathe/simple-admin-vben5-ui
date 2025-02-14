import type { BaseListResp } from '#/api/model/baseModel';

import type { UserInfo } from '../../sys/model/userModel';

export interface CommentInfo {
  id?: number;
  createdAt?: number;
  updatedAt?: number;
  // NoteId
  noteId?: number;

  // ReplyId
  replyId?: number;

  // Content
  content?: string;

  // CreatedBy
  createdBy?: string;

  // like | 点赞数
  like?: number;

  // dislike | 不喜欢数
  dislike?: number;

  // Subject
  subject?: number;

  // Question
  question?: number;

  // ReplyParentsId
  replyParentsId?: number;

  // likeType | 当前用户的喜欢类型
  likeType?: number;

  // repliesCount | 回复总数
  repliesCount?: number;

  // replies
  replies?: CommentInfo[];

  // User | 用户信息
  user?: UserInfo;

  // ReplyUser | 回复用户信息
  replyUser?: UserInfo;
}

export interface ListCommentReq {
  page?: number;
  pageSize?: number;
  subject?: number;
  question?: number;
  replyId?: number;
  replyParentsId?: number;
  noteId?: number;
  createdBy?: string;
}

export interface likeCommentReq {
  id: number;
  likeType: number;
}

export type ListCommentResp = BaseListResp<CommentInfo>;
