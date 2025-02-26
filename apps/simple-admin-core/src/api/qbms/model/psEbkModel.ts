import type { BaseListResp } from '../../model/baseModel';

/**
 *  @description: PsEbk info response
 */
export interface PsEbkInfo {
  id?: number;
  createdAt?: number;
  updatedAt?: number;
  questionsCount?: number;
  subject?: number;
  createdBy?: string;
  default?: number;
  name?: string;
  chapters?: number[];
}

export interface EbkDetail {
  id?: number;
  ebkId?: number;
  questionId: number;
}

export interface ListEbkReq {
  subject?: number;
  page: number;
  pageSize: number;
}
/**
 *  @description: PsEbk list response
 */

export type PsEbkListResp = BaseListResp<PsEbkInfo>;
