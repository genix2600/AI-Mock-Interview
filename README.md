# AI Mock Interview Platform  
A real-time, voice enabled AI system designed for the **UpSkill India Challenge (Techfest IIT Bombay)**. The platform simulates a progessional technical interview environment, generating dynamic questions and providing structured, objective feedback for career readiness.

## Project Overview
Traditional mock interviews suffer from inconsistency and lack of personalized, objective metrics. Our platform addresses this by leveraging Large Language Models (LLMs) and Speech-to-Text (STT) to deliver a scalable, fully automated interview experience.


- **Real-time Voice Interaction: User speaks their answers; the system transcribes and responds with the next question.**

- **Domain Specificity: Supports multiple role tracks (e.g., Data Analyst, ML Engineer, Cybersecurity).**

- **Contextual Interview Flow: LLM dynamically generates follow-up questions based on the user's previous answers, simulating a human interviewer.**

- **Structured Evaluation: Provides granular scoring on Technical Correctness, Communication Clarity, and Fluency.**


##

### Core AI Functionality
- Whisper-based audio transcription (API)
- LLM-powered question generation (GPT/Gemini)
- Rule-based + model-assisted evaluation engine
- Database Integration: Firebase Admin SDK

### API Endpoints
- `/health` - GET - API Health Check
- `/interview/transcribe` - POST - Converts user audio to text transcript
- `/interview/generate_question` - POST - Generates the next dynamic question
- `/interview/evaluate` - POST - Generates final structured score and feedback
---

## System Architecture
The system uses a lightweight **microservice-style architecture** centered around a Python backend managing the AI orchestration and state.

### Backend - FastAPI (Python)
### Frontend - React (TypeScript)
### LLM - OpenAI/Gemini APIs
### Database - Firebase


=======
## Team
- `Aaryaman Vaidya` - Team Lead
- `Abhav Jain` - Backend/Frontend Developer
- `Annem Saad` - AI Research / Testing
- `Ritam Sarkar` - Documentation