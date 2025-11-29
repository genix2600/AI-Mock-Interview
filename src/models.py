# src/models.py
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List

# --- Request Models ---

class InterviewRequest(BaseModel):
    """Input for generating the next question."""
    session_id: str = Field(..., description="Unique ID for tracking the interview session.")
    role: str = Field(..., description="The job role being interviewed for (e.g., 'Data Analyst').")
    user_answer: Optional[str] = Field(None, description="The user's last transcribed answer text.")
    # difficulty can be managed internally or included here if needed later

class EvaluationRequest(BaseModel):
    """Input for triggering the final evaluation."""
    session_id: str
    role: str
    full_transcript: str = Field(..., description="Concatenated string of the full Q&A conversation history.")
    audio_features: Optional[Dict[str, Any]] = None # For potential external scoring features

# --- Response Models ---

class TranscriptionResponse(BaseModel):
    """Output after transcribing user audio."""
    session_id: str
    transcript: str
    # We remove audio_path, as it's an internal detail, not API output

class InterviewResponse(BaseModel):
    """Output containing the AI's question."""
    session_id: str
    ai_question: str
    is_complete: bool = False

class EvaluationReport(BaseModel):
    """The structured output model for the LLM evaluation (0.0 to 10.0 scores)."""
    technical_score: float = Field(..., ge=0, le=10)
    clarity_score: float = Field(..., ge=0, le=10)
    fluency_score: float = Field(..., ge=0, le=10)
    detailed_feedback: str
    technical_strengths: List[str]
    technical_weaknesses: List[str]