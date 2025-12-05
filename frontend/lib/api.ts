import { supabase } from './supabase';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';

export interface Course {
  id: string;
  name: string;
  created_at: string;
  user_id: string;
}

export interface Note {
  id: string;
  course_id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export class ApiError extends Error {
  constructor(public message: string, public status?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

export const createCourse = async (name: string): Promise<Course> => {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;

  if (!token) {
    throw new ApiError('Not authenticated', 401);
  }

  const response = await fetch(`${API_BASE_URL}/courses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ name }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new ApiError(errorData.detail || 'Failed to create course', response.status);
  }

  return response.json();
};

export const getCourses = async (): Promise<Course[]> => {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;

  if (!token) {
    throw new ApiError('Not authenticated', 401);
  }

  const response = await fetch(`${API_BASE_URL}/courses`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new ApiError(errorData.detail || 'Failed to fetch courses', response.status);
  }

  return response.json();
};

export const createNote = async (courseId: string, title: string): Promise<Note> => {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;

  if (!token) {
    throw new ApiError('Not authenticated', 401);
  }

  const response = await fetch(`${API_BASE_URL}/courses/${courseId}/notes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ title }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new ApiError(errorData.detail || 'Failed to create note', response.status);
  }

  return response.json();
};

export const updateCourse = async (courseId: string, name: string): Promise<Course> => {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;

  if (!token) {
    throw new ApiError('Not authenticated', 401);
  }

  const response = await fetch(`${API_BASE_URL}/courses/${courseId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ name }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new ApiError(errorData.detail || 'Failed to update course', response.status);
  }

  return response.json();
};

export const deleteCourse = async (courseId: string): Promise<void> => {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;

  if (!token) {
    throw new ApiError('Not authenticated', 401);
  }

  const response = await fetch(`${API_BASE_URL}/courses/${courseId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
     const errorData = await response.json().catch(() => ({}));
    throw new ApiError(errorData.detail || 'Failed to delete course', response.status);
  }
};

export const getNotes = async (courseId: string): Promise<Note[]> => {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;

  if (!token) {
    throw new ApiError('Not authenticated', 401);
  }

  const response = await fetch(`${API_BASE_URL}/courses/${courseId}/notes`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new ApiError(errorData.detail || 'Failed to fetch notes', response.status);
  }

  return response.json();
};

export const getNote = async (noteId: string): Promise<Note> => {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;

  if (!token) {
    throw new ApiError('Not authenticated', 401);
  }

  const response = await fetch(`${API_BASE_URL}/notes/${noteId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new ApiError(errorData.detail || 'Failed to fetch note', response.status);
  }

  return response.json();
};

export const updateNote = async (noteId: string, content?: string, title?: string): Promise<Note> => {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;

  if (!token) {
    throw new ApiError('Not authenticated', 401);
  }

  const body: { content?: string; title?: string } = {};
  if (content !== undefined) body.content = content;
  if (title !== undefined) body.title = title;

  const response = await fetch(`${API_BASE_URL}/notes/${noteId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new ApiError(errorData.detail || 'Failed to update note', response.status);
  }

  return response.json();
};

export const deleteNote = async (noteId: string): Promise<void> => {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;

  if (!token) {
    throw new ApiError('Not authenticated', 401);
  }

  const response = await fetch(`${API_BASE_URL}/notes/${noteId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(errorData.detail || 'Failed to delete note', response.status);
  }
};

// Aliases for domain mapping (Lectures are Notes)
export type Lecture = Note;
export const getLectures = getNotes;
export const getLectureNotes = getNote;
export const createLecture = createNote;
export const updateLectureNotes = updateNote;

export interface QuizHistoryItem {
  id: string;
  title: string;
  created_at: string;
  course_id: string | null;
}

export const getQuizHistory = async (): Promise<QuizHistoryItem[]> => {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;

  if (!token) {
    throw new ApiError('Not authenticated', 401);
  }

  const response = await fetch(`${API_BASE_URL}/quizzes`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new ApiError(errorData.detail || 'Failed to fetch quiz history', response.status);
  }

  return response.json();
};

export const deleteQuiz = async (quizId: string): Promise<void> => {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;

  if (!token) {
    throw new ApiError('Not authenticated', 401);
  }

  const response = await fetch(`${API_BASE_URL}/quiz/${quizId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  console.log('deleteQuiz response status:', response.status);
  console.log('deleteQuiz response ok:', response.ok);

  if (!response.ok && response.status !== 204) {
     const errorData = await response.json().catch(() => ({}));
    throw new ApiError(errorData.detail || 'Failed to delete quiz', response.status);
  }
};

export const generateQuiz = async (noteIds: string[], quizLength: number): Promise<any> => {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;

  if (!token) {
    throw new ApiError('Not authenticated', 401);
  }

  const response = await fetch(`${API_BASE_URL}/quiz/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ note_ids: noteIds, quiz_length: quizLength }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new ApiError(errorData.detail || 'Failed to generate quiz', response.status);
  }

  return response.json();
};