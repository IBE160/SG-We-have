import { supabase } from './supabase';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export interface Course {
  id: string;
  name: string;
  created_at: string;
  user_id: string;
}

export interface Lecture {
  id: string;
  course_id: string;
  title: string;
  created_at: string;
}

export interface Note {
  id: string;
  lecture_id: string;
  content: string;
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

export const createLecture = async (courseId: string, title: string): Promise<Lecture> => {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;

  if (!token) {
    throw new ApiError('Not authenticated', 401);
  }

  const response = await fetch(`${API_BASE_URL}/courses/${courseId}/lectures`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ title }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new ApiError(errorData.detail || 'Failed to create lecture', response.status);
  }

  return response.json();
};

export const getLectures = async (courseId: string): Promise<Lecture[]> => {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;

  if (!token) {
    throw new ApiError('Not authenticated', 401);
  }

  const response = await fetch(`${API_BASE_URL}/courses/${courseId}/lectures`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new ApiError(errorData.detail || 'Failed to fetch lectures', response.status);
  }

  return response.json();
};

export const getLectureNotes = async (lectureId: string): Promise<Note | null> => {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;

  if (!token) {
    throw new ApiError('Not authenticated', 401);
  }

  const response = await fetch(`${API_BASE_URL}/lectures/${lectureId}/notes`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    const errorData = await response.json();
    throw new ApiError(errorData.detail || 'Failed to fetch notes', response.status);
  }

  const json = await response.json();
  // Wrap in data property check if backend follows standard response structure
  // The context says Response: 200 OK: { "data": { ... } }
  // But previous APIs seem to return list directly or object directly.
  // I will check the architecture doc.
  // Architecture doc says: { "data": { ... }, "meta": { ... } }
  // But `createLecture` implementation in story 1.5 returned `response.data[0]` which is the object itself, and the FastAPI code returned the object directly `return response.data[0]`.
  // Wait, let me re-read the `lectures.py` file I read earlier.
  // `return response.data[0]` in `create_lecture`.
  // `return response.data` in `get_lectures`.
  // So it seems the backend returns the object directly, NOT wrapped in `{ data: ... }`.
  // The "API Contract" in Architecture might be aspirational or I might have misread the actual implementation vs spec.
  // Let's look at `lectures.py` again from the `read_file` output in previous turn.
  // It returns `response.data[0]` (a dict) or `response.data` (a list of dicts).
  // FastAPIs `response_model` will serialize this.
  // So `getLectureNotes` should expect the `Note` object directly.
  
  return json; 
};
