from fastapi import APIRouter, HTTPException
import uuid
import os
from ..database import get_db_manager 
from .. import stt_service, llm, evaluation
from ..models import (
    InterviewRequest, InterviewResponse, EvaluationRequest, EvaluationReport, 
    TranscriptionResponse, TranscriptionInput
)

router = APIRouter(
    prefix="/interview",
    tags=["Interview Core"]
)

TMP_DIR = "tmp/mock_interview"

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
    

# --- Endpoint 2: Generate Question (FUNCTIONAL) ---
@router.post("/generate_question", response_model=InterviewResponse)
async def generate_question(req: InterviewRequest):
    session_id = req.session_id if req.session_id else str(uuid.uuid4())
    
    db_manager = get_db_manager()
    history = db_manager.get_history(session_id)
    ai_question = None 
    
    if not history and req.user_answer is None:
        # A. FIRST CALL: Start session
        db_manager.start_session(session_id, req.role, user_id=req.user_id)
        # Call the functional routine
        ai_question = llm.generate_contextual_question(role=req.role, context="START") 
        db_manager.append_qa_pair(session_id, question=ai_question, answer="")
        
    elif req.user_answer is not None:
        # B. SUBSEQUENT CALL: Process answer, save, and generate follow-up
        last_question = history[-1].get('Q', 'Initial Greeting') 
        db_manager.append_qa_pair(session_id, last_question, req.user_answer)
        
        # Generate follow-up question (Pass history for context)
        full_context = "\n".join([f"Q: {qa['Q']} A: {qa['A']}" for qa in db_manager.get_history(session_id)])
        
        # Call the functional routine
        ai_question = llm.generate_contextual_question(
            role=req.role, 
            context=full_context,
            user_answer=req.user_answer
        )
        
        db_manager.append_qa_pair(session_id, question=ai_question, answer="")

    elif history:
        # C. IF HISTORY EXISTS BUT NO NEW ANSWER: Return the last unanswered question
        ai_question = history[-1].get('Q', 'Error: Please provide an answer.')

    else:
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
    
    try:
        # 1. Generate the structured report using the functional evaluation logic
        # Replaces the dummy report instantiation
        evaluation_data = evaluation.get_final_evaluation_json(
            role=req.role,
            full_transcript=req.full_transcript
        )
        report = EvaluationReport(**evaluation_data) 
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI Evaluation processing failed: {e}")

    # 2. DB_MANAGER to save the final report to Firebase
    db_manager = get_db_manager()
    db_manager.save_final_report(req.session_id, report.model_dump())

    return report