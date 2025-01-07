import {
  type BaseDataResp,
  type BaseIDReq,
  type BaseIDsReq,
  type BaseResp,
} from '#/api/model/baseModel';
import { requestClient } from '#/api/request';

import {
  type QuestionInfo,
  type QuestionListReq,
  type QuestionListResp,
} from './model/questionModel';

enum Api {
  CreateQuestion = '/question-api/question/create',
  DeleteQuestion = '/question-api/question/delete',
  GetQuestionById = '/question-api/question',
  GetQuestionList = '/question-api/question/list',
  UpdateQuestion = '/question-api/question/update',
}

/**
 * @description: Get question list
 */

export const getQuestionList = (params: QuestionListReq) => {
  return requestClient.post<BaseDataResp<QuestionListResp>>(
    Api.GetQuestionList,
    params,
  );
};

/**
 *  @description: Create a new question
 */
export const createQuestion = (params: QuestionInfo) => {
  return requestClient.post<BaseResp>(Api.CreateQuestion, params);
};

/**
 *  @description: Update the question
 */
export const updateQuestion = (params: QuestionInfo) => {
  return requestClient.post<BaseResp>(Api.UpdateQuestion, params);
};

/**
 *  @description: Delete questions
 */
export const deleteQuestion = (params: BaseIDsReq) => {
  return requestClient.post<BaseResp>(Api.DeleteQuestion, params);
};

/**
 *  @description: Get question By ID
 */
export const getQuestionById = (params: BaseIDReq) => {
  return requestClient.post<BaseDataResp<QuestionInfo>>(
    Api.GetQuestionById,
    params,
  );
};
