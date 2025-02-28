import type { BaseListResp } from '../../model/baseModel';

export interface PdfTaskInfo {
  id?: string;
  createdAt?: number;
  updatedAt?: number;
  createdBy?: string;
  status?: number;
  message?: string;
  questionCount?: number;
  fileName?: string;
  duration?: number;
  startedAt?: number;
  downloadUrl?: string;
}

export type ListPdfTaskResp = BaseListResp<PdfTaskInfo>;
