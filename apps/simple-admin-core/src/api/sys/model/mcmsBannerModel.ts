import { type BaseListResp } from '../../model/baseModel';

/**
 *  @description: McmsBanner info response
 */
export interface McmsBannerInfo {
  id?: string;
  createdAt?: number;
  updatedAt?: number;
  status?: number;
  image?: string;
  type?: number;
  name?: string;
  description?: string;
  reference?: string;
}

/**
 *  @description: McmsBanner list response
 */

export type McmsBannerListResp = BaseListResp<McmsBannerInfo>;
