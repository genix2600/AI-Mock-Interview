export type InterviewRole = "Data Analyst" | "ML Engineer" | "Cybersecurity Analyst" | string;


export interface InterviewRequest {
    session_id: string;
    user_id: string;      // Defaults to "guest"
    role: InterviewRole;
    user_answer: string | null; // Null for the very first request (Start Session)
    difficulty?: string;  // Optional parameter
    job_description?: string; // Optional: Added to match backend updates
}

export interface TranscriptionInput {
    session_id: string;
    audio_data_uri: string; // The Base64 string: "data:audio/webm;base64,..."
}

export interface EvaluationRequest {
    session_id: string;
    role: string;
    full_transcript: string; // The accumulated Q&A history to be graded
    difficulty?: string;     // Optional: Added to match backend updates
    job_description?: string; // Optional: Added to match backend updates
}

export interface InterviewResponse {
    session_id: string;
    ai_question: string;
    is_complete: boolean; 
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
    technical_score: number; // 0-100
    clarity_score: number;   // 0-100
    fluency_score: number;   // 0-100
    detailed_feedback: string;
    technical_strengths: string[];
    technical_weaknesses: string[];
    
    improvement_plan: string[];
    learning_resources: string[];
    final_verdict: string;
}