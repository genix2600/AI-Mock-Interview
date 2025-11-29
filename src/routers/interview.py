# src/routers/interview.py
from fastapi import APIRouter, UploadFile, File, HTTPException
import uuid
import aiofiles
import os
import time # For dummy file reading simulation

# Import the stubs and models (Ensure these paths are correct in your structure)
from .. import whisper_test, llm, evaluation
from ..models import InterviewRequest, InterviewResponse, EvaluationRequest, EvaluationReport, TranscriptionResponse

# Define the path for temporary files
TMP_DIR = "tmp/mock_interview"

router = APIRouter(
    prefix="/interview",
    tags=["Interview Core"]
)

# --- Endpoint 1: Transcribe Audio (/interview/transcribe) ---
@router.post("/transcribe", response_model=TranscriptionResponse)
async def transcribe_audio(file: UploadFile = File(...), session_id: str = "temp_id"):
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file uploaded")
    
    os.makedirs(TMP_DIR, exist_ok=True)
    tmp_name = os.path.join(TMP_DIR, f"{uuid.uuid4().hex}_{file.filename}")
    
    # Write file content asynchronously
    try:
        async with aiofiles.open(tmp_name, "wb") as out:
            content = await file.read()
            await out.write(content)
        
        # Call the stub/Whisper model
        transcript = whisper_test.transcribe_file(tmp_name)
        
        # Clean up the temp file
        os.remove(tmp_name)

        return TranscriptionResponse(session_id=session_id, transcript=transcript)

    except Exception as e:
        # Ensure cleanup on failure
        if os.path.exists(tmp_name):
            os.remove(tmp_name)
        raise HTTPException(status_code=500, detail=f"Transcription failed: {e}")

# --- Endpoint 2: Generate Question (/interview/generate_question) ---
@router.post("/generate_question", response_model=InterviewResponse)
async def generate_question(req: InterviewRequest):
    # This stub logic needs to be enhanced to handle session_id properly
    
    q = llm.generate_question_stub(role=req.role, user_answer=req.user_answer)
    
    # Assuming the stub returns the question text
    return InterviewResponse(session_id=req.session_id, ai_question=q)

# --- Endpoint 3: Evaluate (/interview/evaluate) ---
@router.post("/evaluate", response_model=EvaluationReport)
async def evaluate_session(req: EvaluationRequest):
    # This stub needs to be updated to integrate Abhav's JSON logic
    
    semantic = llm.semantic_evaluate_stub(req.full_transcript, req.role)
    # The evaluation.combine_scores stub needs to be replaced with the LLM call that returns EvaluationReport
    
    # DUMMY implementation to return the required Pydantic model
    return EvaluationReport(
        technical_score=8.0,
        clarity_score=7.5,
        fluency_score=8.2,
        detailed_feedback=semantic,
        technical_strengths=["Strong fundamentals"],
        technical_weaknesses=["Lack of industry examples"]
    )