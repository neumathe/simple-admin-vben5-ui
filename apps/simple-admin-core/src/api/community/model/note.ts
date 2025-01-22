export interface NoteInfo {
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
