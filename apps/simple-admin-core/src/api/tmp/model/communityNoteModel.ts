import { type BaseListResp } from '../../model/baseModel';

/**
 *  @description: CommunityNote info response
 */
export interface CommunityNoteInfo {
  id?: number;
  createdAt?: number;
  updatedAt?: number;
  subject?: number;
  question?: number;
  content?: string;
  createdBy?: string;
  like?: number;
  dislike?: number;
  deletedBy?: string;
  published?: boolean;
}

/**
 *  @description: CommunityNote list response
 */

export type CommunityNoteListResp = BaseListResp<CommunityNoteInfo>;
