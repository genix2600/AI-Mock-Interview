from fastapi import APIRouter, UploadFile, File, HTTPException
import uuid
import aiofiles
import os

from ..database import get_db_manager 

# Import the stubs and models
from .. import whisper_test, llm, evaluation
from ..models import InterviewRequest, InterviewResponse, EvaluationRequest, EvaluationReport, TranscriptionResponse

TMP_DIR = "tmp/mock_interview"

router = APIRouter(
    prefix="/interview",
    tags=["Interview Core"]
)

# --- Endpoint 1: Transcribe Audio
@router.post("/transcribe", response_model=TranscriptionResponse)
async def transcribe_audio(file: UploadFile = File(...), session_id: str = "temp_id"):
    
    
    try:
        transcript = whisper_test.transcribe_file(tmp_name)
        os.remove(tmp_name)
        return TranscriptionResponse(session_id=session_id, transcript=transcript)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Transcription failed: {e}")

@router.post("/generate_question", response_model=InterviewResponse)
async def generate_question(req: InterviewRequest):
    session_id = req.session_id if req.session_id else str(uuid.uuid4())
    

    db_manager = get_db_manager()

    history = db_manager.get_history(session_id)
    
    if not history and req.user_answer is None:
    
        db_manager.start_session(session_id, req.role)
        
        ai_question = llm.generate_question_stub(role=req.role) 
        
    elif req.user_answer is not None:
        last_question = history[-1]['Q'] if history else "Initial Greeting" 
        db_manager.append_qa_pair(session_id, last_question, req.user_answer)
        
        #Generate follow-up question (Pass history for context)
        full_context = "\n".join([f"Q: {qa['Q']} A: {qa['A']}" for qa in db_manager.get_history(session_id)])
        
        ai_question = llm.generate_question_stub(
            role=req.role, 
            context=full_context,
            user_answer=req.user_answer
        )
        
    else:
        # Should not happen if logic is correct
        raise HTTPException(status_code=400, detail="Invalid request state.")
        
    return InterviewResponse(
        session_id=session_id, 
        ai_question=ai_question, 
        is_complete="stop" in ai_question.lower() # Placeholder
    )

#Endpoint 3: Evaluate (/interview/evaluate)
@router.post("/evaluate", response_model=EvaluationReport)
async def evaluate_session(req: EvaluationRequest):
    # DUMMY
    report = EvaluationReport(
        technical_score=8.0,
        clarity_score=7.5,
        fluency_score=8.2,
        detailed_feedback="Placeholder feedback.",
        technical_strengths=["Strong fundamentals"],
        technical_weaknesses=["Lack of industry examples"]
    )
    
    # DB_MANAGER to save the final report to Firebase
    db_manager = get_db_manager()
    db_manager.save_final_report(req.session_id, report.model_dump())

    return report