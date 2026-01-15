export interface Batch {
  _id: string;
  title: string;
  image?: string;
  [key: string]: unknown;
}

export interface Subject {
  _id: string;
  title?: string;
  subjectName?: string;
  name?: string;
  totalVideos?: number;
  totalNotes?: number;
  [key: string]: unknown;
}

export interface Lecture {
  _id: string;
  title?: string;
  name?: string;
  order?: number;
  duration?: string;
  link?: string;
  image?: string;
  [key: string]: unknown;
}

export type Screen = 'batches' | 'subjects' | 'lectures';
