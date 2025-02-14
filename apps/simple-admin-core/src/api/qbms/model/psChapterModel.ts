import type { BaseListResp } from '../../model/baseModel';

/**
 *  @description: PsChapter info response
 */
export interface PsChapterInfo {
  id: number;
  subjectId?: number;
  chapterId?: string;
  chapterName: string;
  parentId?: number;
  createdBy?: string;
  count: number;
}

export interface ChapterInfo {
  title: string;
  key: number;
  children?: ChapterInfo[];
  count: number;
}

export interface GetChapterReq {
  subjectId: number;
  chapterId?: string;
}

/**
 *  @description: PsChapter list response
 */

export type PsChapterListResp = BaseListResp<PsChapterInfo>;
