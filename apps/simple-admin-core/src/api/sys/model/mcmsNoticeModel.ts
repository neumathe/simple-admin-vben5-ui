import { type BaseListResp } from '../../model/baseModel';

/**
 *  @description: McmsNotice info response
 */
export interface McmsNoticeInfo {
  id?: string;
  createdAt?: number;
  updatedAt?: number;
  status?: number;
  title?: string;
  content?: string;
  type?: number;
  duration?: number;
  once?: number;
  reference?: string;
}

/**
 *  @description: McmsNotice list response
 */

export type McmsNoticeListResp = BaseListResp<McmsNoticeInfo>;
