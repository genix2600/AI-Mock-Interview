// frontend/services/api.ts
import { 
  InterviewRequest, 
  InterviewResponse, 
  TranscriptionInput, 
  TranscriptionResponse, 
  EvaluationRequest, 
  EvaluationReport 
} from '@/types/apiTypes';

const API_BASE_URL = "http://127.0.0.1:8000/interview";

async function apiCall<T>(endpoint: string, data: any): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Add Authorization headers here if you add auth later
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      // Try to parse the specific error message from the backend (FastAPI HTTPException)
      const errorData = await response.json().catch(() => ({ detail: response.statusText }));
      throw new Error(errorData.detail || `API Error: ${response.status}`);
    }

    return await response.json() as T;
  } catch (error) {
    console.error(`API Call Failed [${endpoint}]:`, error);
    throw error; // Re-throw to be handled by the component UI
  }
}

// --- API Functions ---

/**
 * Starts a session or submits an answer to get the next question.
 * Backend Endpoint: POST /interview/generate_question
 */
export const fetchNextQuestion = (data: InterviewRequest): Promise<InterviewResponse> => {
  return apiCall<InterviewResponse>('generate_question', data);
};

/**
 * Sends Base64 audio string to Gemini for transcription and analysis.
 * Backend Endpoint: POST /interview/transcribe
 */
export const sendAudioForTranscription = (data: TranscriptionInput): Promise<TranscriptionResponse> => {
  return apiCall<TranscriptionResponse>('transcribe', data);
};

/**
 * Generates the final performance report.
 * Backend Endpoint: POST /interview/evaluate
 */
export const fetchEvaluation = (data: EvaluationRequest): Promise<EvaluationReport> => {
  return apiCall<EvaluationReport>('evaluate', data);
};