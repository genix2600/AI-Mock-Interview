# AI Mock Interview Platform  
A real-time AI-powered mock interview system designed for the **UpSkill India Challenge (Techfest IIT Bombay – Round 2)**.  
The platform conducts voice-based interviews, generates domain-specific questions, evaluates responses using NLP, and provides personalized feedback for career readiness.

## Project Overview
Preparing for interviews is difficult due to limited practice opportunities and inconsistent feedback.  
Our platform solves this by enabling:

- **Real-time voice interviews**
- **Automatic speech-to-text transcription (Whisper)**
- **Role-specific interview modes** (Data Analyst, ML Engineer, Cybersecurity, etc.)
- **AI-generated follow-up questions**
- **Automated scoring** (technical, communication, confidence)
- **Personalized improvement plan**
- **Firebase-backed storage for session data**

This prototype demonstrates the **core logic, architecture, and workflow** required for the full-scale solution.

## Features Implemented in Round 2 (60–80% Prototype Build)
### ✔ Core AI Functionality
- Whisper-based audio transcription (local/API)
- LLM-powered question generation (GPT/Llama)
- Rule-based + model-assisted evaluation engine
- JSON-based structured feedback

### ✔ Backend (FastAPI)
- `/transcribe` — Converts audio → text  
- `/ask` — Generates next question  
- `/evaluate` — Returns scores + feedback  

### ✔ Frontend (React)
- Audio recording interface  
- Role selection UI  
- API integration with backend  
- Display of feedback + questions  

### ✔ Database (Firebase)
- Stores transcripts  
- Stores user interview sessions  
- Stores feedback reports  

---

## System Architecture
The system uses a lightweight **microservice-style architecture**: