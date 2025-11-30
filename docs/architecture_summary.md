# Architecture

This project is organized into three primary layers: a React frontend, a FastAPI backend, and external AI services (Whisper and an LLM provider). Firebase Firestore is used for persistent data storage. The backend coordinates all data flow between components.

## 1. Frontend (React)

The frontend manages all user-facing behavior.

- Records audio using browser media APIs
- Sends audio files to the backend for transcription
- Displays transcripts and generated interview questions
- Submits transcripts and conversation history
- Renders the final evaluation report

The frontend contains minimal business logic. Most processing is delegated to the backend and AI services.

## 2. Backend (FastAPI)

FastAPI functions as the central application server.

### Responsibilities

- Hosts API endpoints (/transcribe, /ask, /evaluate)
- Forwards audio to Whisper for transcription
- Sends transcripts and history to the LLM
- Returns questions and evaluation results to the frontend
- Stores Q&A pairs, transcripts, and reports in Firebase
- Maintains session-level state across the interview

### Rationale

FastAPI provides asynchronous performance, simple routing, automatic documentation, and clean integration with external AI APIs. It is lightweight and suitable for real-time workflows.

## 3. External AI Services

### Whisper API (Transcription)

Used only during the /transcribe endpoint.
Receives audio from FastAPI and returns transcript text.

### LLM API (Question Generation and Evaluation)

Used during /ask and /evaluate.

- Generates context-aware interview questions
- Analyzes the full conversation
- Produces a structured evaluation report

## 4. Database Layer (Firebase Firestore)

Firestore stores all persistent data:

- Question–answer history
- Full transcripts
- Final evaluation reports
- Session metadata

Its document-based structure fits conversational and semi-structured data.

## 5. Data Flow

1. The user records audio in the React client.
2. The client sends audio to FastAPI via /transcribe.
3. FastAPI forwards audio to Whisper and returns the transcript.
4. The client sends the transcript and Q&A history to /ask.
5. FastAPI requests the next question from the LLM.
6. FastAPI stores the Q&A pair in Firebase.
7. Steps 4–6 repeat for each question.
8. The client calls /evaluate with the final transcript.
9. FastAPI requests a structured evaluation from the LLM.
10. FastAPI stores the report and returns it to the client.

## 6. Architectural Summary

| Component       | Technology  | Purpose                                             |
|-----------------|-------------|-----------------------------------------------------|
| Frontend        | React       | UI, audio capture, and user interaction             |
| Backend         | FastAPI     | Request routing, orchestration, AI and DB handling  |
| Transcription   | Whisper API | Converts audio into text                            |
| Interview Logic | LLM API     | Generates questions and final evaluation            |
| Database        | Firebase    | Stores transcripts, Q&A history, and evaluation     |
