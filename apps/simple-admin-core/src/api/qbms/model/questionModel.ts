import { type BaseListResp } from '../../model/baseModel';

/**
 *  @description: QuestionChoice info response
 */
export interface QuestionChoiceInfo {
  id?: number;
  questionId?: number;
  isAnswer?: boolean;
  choice?: string;
  choiceImage?: string;
  choiceImageHash?: string;
  choiceRenderType?: number;
  choiceId?: string;
}

/**
 *  @description: Question info response
 */
export interface QuestionInfo {
  id: number;
  subjectId?: number;
  chapterId?: number;
  questionId?: string;
  difficulty?: string;
  answer?: string;
  questionType?: number;
  question?: string;
  questionImage?: string;
  questionImageHash?: string;
  analysis?: string;
  analysisImage?: string;
  analysisImageHash?: string;
  questionRenderType?: number;
  analysisRenderType?: number;
  createdBy?: string;
  choice?: QuestionChoiceInfo[];
  star?: boolean;
  input?: string;
}

/**
 *  @description: Question list response
 */

export type QuestionListResp = BaseListResp<QuestionInfo>;

export interface QuestionListReq {
  page: number;
  pageSize: number;
  subject: number;
  chapter: number;
}
