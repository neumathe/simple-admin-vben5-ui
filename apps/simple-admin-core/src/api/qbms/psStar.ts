import { type BaseResp } from '#/api/model/baseModel';
import { requestClient } from '#/api/request';

import { type StarRequest } from './model/psStarModel';

enum Api {
  Star = '/question-api/star',
}

export const createStar = (params?: StarRequest) => {
  return requestClient.post<BaseResp>(Api.Star, params);
};

export const deleteStar = (params?: StarRequest) => {
  return requestClient.delete<BaseResp>(Api.Star, params);
};
