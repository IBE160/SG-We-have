import { supabase } from '../supabase';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export interface OptionResponse {
  id: string;
  option_text: string;
  option_index: number;
}

export interface QuestionDisplay {
  id: string;
  question_text: string;
  options: OptionResponse[];
}

export interface QuizStartResponse {
  attempt_id: string;
  quiz_id: string;
  quiz_title: string;
  total_questions: number;
  current_question_index: number;
  first_question: QuestionDisplay;
}

export interface QuizSubmissionRequest {
  attempt_id: string;
  question_id: string;
  answer_id: string;
}

export interface QuizSubmissionResponse {
  is_correct: boolean;
  correct_answer_id: string;
  feedback_text: string;
  explanation?: string;
}

export interface QuizNextRequest {
  attempt_id: string;
}

export interface QuizNextResponse {
  attempt_id: string;
  current_question_index: number;
  total_questions: number;
  is_complete: boolean;
  next_question?: QuestionDisplay;
  existing_answer?: QuizSubmissionResponse;
  selected_option_id?: string;
}

export interface QuizPreviousRequest {
  attempt_id: string;
}

export interface QuizPreviousResponse {
  attempt_id: string;
  current_question_index: number;
  total_questions: number;
  previous_question: QuestionDisplay;
  existing_answer?: QuizSubmissionResponse;
  selected_option_id?: string;
}

export interface QuizResultResponse {
  score: number;
  total_questions: number;
  percentage: number;
  completed_at: string;
}

export class ApiError extends Error {
  constructor(public message: string, public status?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

export const getQuizResults = async (quizId: string, attemptId: string): Promise<QuizResultResponse> => {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;

  if (!token) {
    throw new ApiError('Not authenticated', 401);
  }

  // Construct query params
  const queryParams = new URLSearchParams({ attempt_id: attemptId });

  const response = await fetch(`${API_BASE_URL}/quiz/${quizId}/results?${queryParams}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new ApiError(errorData.detail || 'Failed to fetch quiz results', response.status);
  }

  return response.json();
};

export const fetchNextQuestion = async (quizId: string, request: QuizNextRequest): Promise<QuizNextResponse> => {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;

  if (!token) {
    throw new ApiError('Not authenticated', 401);
  }

  const response = await fetch(`${API_BASE_URL}/quiz/${quizId}/next`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new ApiError(errorData.detail || 'Failed to fetch next question', response.status);
  }

  return response.json();
};

export const fetchPreviousQuestion = async (quizId: string, request: QuizPreviousRequest): Promise<QuizPreviousResponse> => {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;

  if (!token) {
    throw new ApiError('Not authenticated', 401);
  }

  const response = await fetch(`${API_BASE_URL}/quiz/${quizId}/previous`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new ApiError(errorData.detail || 'Failed to fetch previous question', response.status);
  }

  return response.json();
};

export const submitAnswer = async (quizId: string, request: QuizSubmissionRequest): Promise<QuizSubmissionResponse> => {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;

  if (!token) {
    throw new ApiError('Not authenticated', 401);
  }

  const response = await fetch(`${API_BASE_URL}/quiz/${quizId}/answer`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new ApiError(errorData.detail || 'Failed to submit answer', response.status);
  }

  return response.json();
};

export const startQuiz = async (quizId: string): Promise<QuizStartResponse> => {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;

  if (!token) {
    throw new ApiError('Not authenticated', 401);
  }

  const response = await fetch(`${API_BASE_URL}/quiz/${quizId}/start`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new ApiError(errorData.detail || 'Failed to start quiz', response.status);
  }

  return response.json();
};

export const retakeQuiz = async (quizId: string, attemptId?: string): Promise<QuizStartResponse> => {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;

  if (!token) {
    throw new ApiError('Not authenticated', 401);
  }

  const response = await fetch(`${API_BASE_URL}/quiz/${quizId}/retake`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ attempt_id: attemptId }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new ApiError(errorData.detail || 'Failed to retake quiz', response.status);
  }

  return response.json();
};
