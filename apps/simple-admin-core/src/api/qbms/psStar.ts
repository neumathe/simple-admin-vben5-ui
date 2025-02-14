import type { BaseResp } from '#/api/model/baseModel';

import type { StarRequest } from './model/psStarModel';

import { requestClient } from '#/api/request';

enum Api {
  Star = '/question-api/star',
}

export const createStar = (params?: StarRequest) => {
  return requestClient.post<BaseResp>(Api.Star, params);
};

export const deleteStar = (params?: StarRequest) => {
  return requestClient.delete<BaseResp>(Api.Star, params);
};
