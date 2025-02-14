import type {
  BaseDataResp,
  BaseIDReq,
  BaseIDResp,
  BaseResp,
} from '../model/baseModel';
import type {
  CommentInfo,
  likeCommentReq,
  ListCommentReq,
  ListCommentResp,
} from './model/comment';

import { requestClient } from '#/api/request';

enum Api {
  CreateComment = '/question-api/community_comment/create',
  DeleteComment = '/question-api/community_comment/delete',
  DeleteCommentC = '/question-api/community_comment',
  LikeComment = '/question-api/community_comment/like',
  ListComment = '/question-api/community_comment/list',
}

export function CreateComment(params: CommentInfo) {
  return requestClient.post<BaseIDResp>(Api.CreateComment, params);
}

export const ListComment = (params: ListCommentReq) => {
  return requestClient.post<BaseDataResp<ListCommentResp>>(
    Api.ListComment,
    params,
  );
};

export const DeleteComment = (params: BaseIDReq) => {
  return requestClient.post<BaseDataResp<CommentInfo>>(
    Api.DeleteComment,
    params,
  );
};

export const DeleteCommentC = (params: BaseIDReq) => {
  return requestClient.delete<BaseDataResp<CommentInfo>>(
    Api.DeleteCommentC,
    params,
  );
};

export const LikeComment = (params: likeCommentReq) => {
  return requestClient.post<BaseResp>(Api.LikeComment, params);
};
