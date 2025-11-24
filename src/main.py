from fastapi import FastAPI, UploadFile, File, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, Any
import uuid
import aiofiles
import os
from . import whisper_test, llm, evaluation

app = FastAPI(title="Mock Interview Backend - Week1 scaffold")

class GenerateRequest(BaseModel):
    role: str
    difficulty: Optional[str] = "medium"

class EvaluateRequest(BaseModel):
    transcript: str
    role: Optional[str] = "data_analyst"
    question_id: Optional[str] = None
    audio_features: Optional[Dict[str, Any]] = None

@app.get("/health")
async def health():
    return {"status": "ok"}

@app.post("/transcribe")
async def transcribe_audio(file: UploadFile = File(...)):
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file uploaded")
    tmp_dir = "/tmp/mock_interview"
    os.makedirs(tmp_dir, exist_ok=True)
    tmp_name = os.path.join(tmp_dir, f"{uuid.uuid4().hex}_{file.filename}")
    async with aiofiles.open(tmp_name, "wb") as out:
        content = await file.read()
        await out.write(content)
    
    transcript = whisper_test.transcribe_file(tmp_name)
    return {"transcript": transcript, "audio_path": tmp_name}

@app.post("/generate_question")
async def generate_question(req: GenerateRequest):
    
    q = llm.generate_question_stub(role=req.role, difficulty=req.difficulty)
    return {"question": q}

@app.post("/evaluate")
async def evaluate(req: EvaluateRequest):
    semantic = llm.semantic_evaluate_stub(req.transcript, req.role, req.question_id)
    eval_json = evaluation.combine_scores(semantic, req.audio_features or {})
    return {"evaluation": eval_json}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("src.main:app", host="0.0.0.0", port=8000, reload=True)
