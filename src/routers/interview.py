from fastapi import APIRouter, HTTPException
import uuid
from ..database import get_db_manager 
from .. import stt_service, llm
from ..models import (
    InterviewRequest, InterviewResponse, EvaluationRequest, EvaluationReport, 
    TranscriptionResponse, TranscriptionInput
)

router = APIRouter(
    prefix="/interview",
    tags=["Interview Core"]
)

# --- Endpoint 1: Transcribe Audio (/interview/transcribe) ---
@router.post("/transcribe", response_model=TranscriptionResponse)
async def transcribe_audio(req: TranscriptionInput):
    """
    Receives audio data URI, transcribes via Gemini multimodal API.
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
    

# --- Endpoint 2: Generate Question (/interview/generate_question) ---
@router.post("/generate_question", response_model=InterviewResponse)
async def generate_question(req: InterviewRequest):
    session_id = req.session_id if req.session_id else str(uuid.uuid4())
    
    db_manager = get_db_manager()
    history = db_manager.get_history(session_id)
    ai_question = None 
    
    # CASE A: FIRST CALL (Start Session)
    if not history and req.user_answer is None:
        db_manager.start_session(session_id, req.role, user_id=req.user_id)
        
        # Pass ALL parameters including new difficulty and JD
        ai_question = llm.generate_contextual_question(
            role=req.role, 
            history=[],
            difficulty=req.difficulty, # <-- New Param
            job_description=req.job_description or "" # <-- New Param
        ) 
        
        # Save the first question with empty answer (placeholder)
        db_manager.append_qa_pair(session_id, question=ai_question, answer="")
        
    # CASE B: SUBSEQUENT CALL (User Answered)
    elif req.user_answer is not None:
        # 1. Update the previous question with the user's answer
        if history:
            last_question = history[-1].get('Q', 'Initial Greeting') 
            db_manager.append_qa_pair(session_id, last_question, req.user_answer)
        
        # 2. Fetch updated history to give context to AI
        updated_history = db_manager.get_history(session_id)
        
        # 3. Generate Next Question with full context
        ai_question = llm.generate_contextual_question(
            role=req.role, 
            history=updated_history,
            difficulty=req.difficulty, # <-- New Param
            job_description=req.job_description or "" # <-- New Param
        )
        
        # 4. Save the new AI question (open loop)
        db_manager.append_qa_pair(session_id, question=ai_question, answer="")

    # CASE C: HISTORY EXISTS BUT NO ANSWER (Resume/Error)
    elif history:
        ai_question = history[-1].get('Q', 'Error: Please provide an answer.')

    else:
        raise HTTPException(status_code=400, detail="Invalid request state.")
        
    is_complete = "stop" in ai_question.lower()

    return InterviewResponse(
        session_id=session_id, 
        ai_question=ai_question, 
        is_complete=is_complete
    )

# --- Endpoint 3: Evaluate (/interview/evaluate) ---
@router.post("/evaluate", response_model=EvaluationReport)
async def evaluate_session(req: EvaluationRequest):
    try:
        db_manager = get_db_manager()
        
        # 1. Fetch the REAL history from the DB
        history = db_manager.get_history(req.session_id)
        
        print(f"DEBUG: Evaluating Session {req.session_id} with {len(history)} turns.")

        # 2. Generate the report using the merged LLM module
        # Note: We are assuming EvaluationRequest (req) has been updated in models.py
        # to include optional difficulty/job_description, or we default them here.
        evaluation_data = llm.get_final_evaluation_json(
            role=req.role, 
            history=history,
            difficulty=getattr(req, 'difficulty', 'Medium'), # Safe access if model isn't updated
            job_description=getattr(req, 'job_description', '') # Safe access
        )
        
        report = EvaluationReport(**evaluation_data) 
        
        # 3. Save to Firebase
        db_manager.save_final_report(req.session_id, report.model_dump())

        return report

    except Exception as e:
        print(f"Evaluation Error: {e}")
        raise HTTPException(status_code=500, detail=f"AI Evaluation processing failed: {e}")