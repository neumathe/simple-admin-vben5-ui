import { type BaseListResp } from '../../model/baseModel';

/**
 *  @description: PsSubject info response
 */
export interface PsSubjectInfo {
  id?: number;
  name?: string;
  createdBy?: string;
}

/**
 *  @description: PsSubject list response
 */

export type PsSubjectListResp = BaseListResp<PsSubjectInfo>;
