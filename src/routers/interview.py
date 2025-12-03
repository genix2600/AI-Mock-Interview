from fastapi import APIRouter, HTTPException # Removed UploadFile, File, aiofiles
import uuid
import os

from ..database import get_db_manager 

from .. import stt_service, llm, evaluation
from ..models import (
    InterviewRequest, InterviewResponse, EvaluationRequest, EvaluationReport, 
    TranscriptionResponse, TranscriptionInput # Added TranscriptionInput
)

TMP_DIR = "tmp/mock_interview"

router = APIRouter(
    prefix="/interview",
    tags=["Interview Core"]
)

# --- Endpoint 1: Transcribe Audio (/interview/transcribe) ---
@router.post("/transcribe", response_model=TranscriptionResponse)
async def transcribe_audio(req: TranscriptionInput):
    """
    Receives audio data URI, transcribes via Gemini multimodal API, 
    and returns text + audio features.
    """
    if not req.audio_data_uri:
        raise HTTPException(status_code=400, detail="Audio data URI is missing.")
    
    try:
        analysis_data = stt_service.transcribe_and_analyze_audio(req.audio_data_uri)
        
        audio_features = {
            "speechRateWpm": analysis_data.get("speechRateWpm", 0.0),
            "fillerRate": analysis_data.get("fillerRate", 0.0),
        }
        
        transcript_length = len(analysis_data.get("transcript", "").split())
        duration_sec = (transcript_length / 180) * 60 if transcript_length > 0 else 1.0

        return TranscriptionResponse(
            session_id=req.session_id,
            transcript=analysis_data.get("transcript", "Transcription failed."),
            duration_sec=duration_sec,
            audio_features=audio_features
        )

    except ConnectionError as e:
        raise HTTPException(status_code=503, detail=f"AI Service Unavailable: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Transcription processing error: {e}")
    

# --- Endpoint 2: Generate Question (FIXED ai_question) ---
@router.post("/generate_question", response_model=InterviewResponse)
async def generate_question(req: InterviewRequest):
    session_id = req.session_id if req.session_id else str(uuid.uuid4())
    
    db_manager = get_db_manager()

    history = db_manager.get_history(session_id)
    
    # 1. INITIALIZE ai_question to handle all code paths
    ai_question = None 
    
    # --- Conversation State Logic ---
    
    if not history and req.user_answer is None:
        # A. FIRST CALL: Start session and get the initial question
        
        db_manager.start_session(session_id, req.role)
        ai_question = llm.generate_question_stub(role=req.role) 
        db_manager.append_qa_pair(session_id, question=ai_question, answer="")
        
    elif req.user_answer is not None:
        # B. SUBSEQUENT CALL: Process answer, save, and generate follow-up
        
        last_question = history[-1].get('Q', 'Initial Greeting') 
        db_manager.append_qa_pair(session_id, last_question, req.user_answer)
        
        # Generate follow-up question (Pass history for context)
        full_context = "\n".join([f"Q: {qa['Q']} A: {qa['A']}" for qa in db_manager.get_history(session_id)])
        
        ai_question = llm.generate_question_stub(
            role=req.role, 
            context=full_context,
            user_answer=req.user_answer
        )
        
        # Save the NEWLY generated question for the NEXT call (unanswered)
        db_manager.append_qa_pair(session_id, question=ai_question, answer="")


    elif history:
        # C. IF HISTORY EXISTS BUT NO NEW ANSWER: Return the last unanswered question
        ai_question = history[-1].get('Q', 'Error: Please provide an answer.')

    else:
        # D. Should not happen if logic is correct
        raise HTTPException(status_code=400, detail="Invalid request state or missing session ID.")
        
    is_complete = "stop" in ai_question.lower()

    return InterviewResponse(
        session_id=session_id, 
        ai_question=ai_question, 
        is_complete=is_complete
    )

# Endpoint 3: Evaluate (/interview/evaluate)
@router.post("/evaluate", response_model=EvaluationReport)
async def evaluate_session(req: EvaluationRequest):
    
    #INITIALIZE report BEFORE use
    report = EvaluationReport(
        technical_score=8.0,
        clarity_score=7.5,
        fluency_score=8.2,
        detailed_feedback="Placeholder feedback.",
        technical_strengths=["Strong fundamentals"],
        technical_weaknesses=["Lack of industry examples"]
    )
    
    
    db_manager = get_db_manager()
    
    db_manager.save_final_report(req.session_id, report.model_dump())

    return report