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

export class ApiError extends Error {
  constructor(public message: string, public status?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

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
