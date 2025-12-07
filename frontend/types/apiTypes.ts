// frontend/types/apiTypes.ts

// --- Shared Types ---
// Defines the specific roles supported by your platform
export type InterviewRole = "Data Analyst" | "ML Engineer" | "Cybersecurity Analyst" | string;

// --- Request Interfaces (Payloads sent to Backend) ---

export interface InterviewRequest {
    session_id: string;
    user_id: string;      // Defaults to "guest"
    role: InterviewRole;
    user_answer: string | null; // Null for the very first request (Start Session)
    difficulty?: string;  // Optional parameter
}

export interface TranscriptionInput {
    session_id: string;
    audio_data_uri: string; // The Base64 string: "data:audio/webm;base64,..."
}

export interface EvaluationRequest {
    session_id: string;
    role: string;
    full_transcript: string; // The accumulated Q&A history to be graded
}

// --- Response Interfaces (Data received from Backend) ---

export interface InterviewResponse {
    session_id: string;
    ai_question: string;
    is_complete: boolean; // Signals frontend to end the session
}

export interface TranscriptionResponse {
    session_id: string;
    transcript: string;
    duration_sec: number;
    audio_features: {
        speechRateWpm: number;
        fillerRate: number;
    };
}

export interface EvaluationReport {
    technical_score: number; // 0-10
    clarity_score: number;   // 0-10
    fluency_score: number;   // 0-10
    detailed_feedback: string;
    technical_strengths: string[];
    technical_weaknesses: string[];
}