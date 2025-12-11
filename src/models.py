from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List

class InterviewRequest(BaseModel):
    """Input for generating the next question."""
    session_id: str = Field(..., description="Unique ID for tracking the interview session.")
    user_id: str = Field("guest", description="ID of the user, used for database indexing.") 
    role: str = Field(..., description="The job role being interviewed for (e.g., 'Data Analyst').")
    user_answer: Optional[str] = Field(None, description="The user's last transcribed answer text.")
    difficulty: Optional[str] = "medium"
    
    job_description: Optional[str] = Field(None, description="Optional job description text.")

class TranscriptionInput(BaseModel):
    """Input containing the Base64 audio URI for the multimodal STT service."""
    session_id: str
    audio_data_uri: str = Field(..., description="Audio content as a data URI (data:<mimetype>;base64,<encoded_data>).")

class EvaluationRequest(BaseModel):
    """Input for triggering the final evaluation."""
    session_id: str
    role: str
    full_transcript: str = Field(..., description="Concatenated string of the full Q&A conversation history.")
    audio_features: Optional[Dict[str, Any]] = None
    
    difficulty: Optional[str] = "medium"
    job_description: Optional[str] = None

class TranscriptionResponse(BaseModel):
    """Output after transcribing user audio via Gemini Multimodal STT."""
    session_id: str
    transcript: str
    duration_sec: float = Field(..., description="Estimated duration of the audio in seconds.") 
    audio_features: Dict[str, float] = Field(..., description="Structured analysis features (WPM, filler rate).") 

class InterviewResponse(BaseModel):
    """Output containing the AI's question."""
    session_id: str
    ai_question: str
    is_complete: bool = False

class EvaluationReport(BaseModel):
    """The structured output model for the LLM evaluation (0-100 scores)."""
    technical_score: int = Field(..., ge=0, le=100)
    clarity_score: int = Field(..., ge=0, le=100)
    fluency_score: int = Field(..., ge=0, le=100)
    
    detailed_feedback: str
    technical_strengths: List[str]
    technical_weaknesses: List[str]
    
    # NEW FIELDS ADDED HERE
    improvement_plan: List[str] = Field(..., description="Step-by-step actionable plan.")
    learning_resources: List[str] = Field(..., description="Suggested books or documentation.")
    
    final_verdict: str = "Pending"