from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel

app = FastAPI()

class AnswerRequest(BaseModel):
    role: str
    transcript: str

@app.get("/")
def root():
    return {"status": "Backend running"}

@app.post("/transcribe")
async def transcribe(audio: UploadFile = File(...)):
    return {"transcript": "TEST"}  # will integrate whisper later

@app.post("/ask")
async def ask(req: AnswerRequest):
    return {"next_question": f"Tell me more about your experience in {req.role}"}

@app.post("/evaluate")
async def evaluate(req: AnswerRequest):
    return {"scores": {"technical": 7, "communication": 6}, "feedback": "Sample"}