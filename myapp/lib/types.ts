export type Course = {
  id: string;
  title: string;
};

export type Note = {
  id: string;
  title: string;
  content: string;
  courseId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Quiz = {
  id: string;
  title: string;
  courseId: string;
  questions: Question[];
};

export type Question = {
  id: string;
  text: string;
  options: Option[];
  correctOptionId: string;
};

export type Option = {
  id: string;
  text: string;
};