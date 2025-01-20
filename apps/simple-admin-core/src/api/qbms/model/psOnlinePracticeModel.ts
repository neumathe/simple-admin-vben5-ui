import { type BaseListResp } from '../../model/baseModel';
import { type QuestionInfo } from './questionModel';
/**
 *  @description: PsOnlinePractice info response
 */
export interface PsOnlinePracticeInfo {
  id?: number;
  timeUsed?: number;
  questionsCount?: number;
  subject?: number;
  type?: number;
  submitedAt?: number;
  score?: number;
  createdBy?: string;
  createAt?: number;
  questions?: QuestionInfo[];
}

export interface CreateOnlinePracticeReq {
  subject: number;
  type: number;
  count: number;
  chapters: number[];
}

export interface QuestionInputInfo {
  id: number;
  input: string;
}

export interface SubmitPracticeReq {
  isFinish: boolean;
  id: number;
  timeUsed: number;
  input: QuestionInputInfo[];
}

export interface SubmitPracticeResp {
  score: number;
  isFinish: boolean;
}

/**
 *  @description: PsOnlinePractice list response
 */

export type PsOnlinePracticeListResp = BaseListResp<PsOnlinePracticeInfo>;
