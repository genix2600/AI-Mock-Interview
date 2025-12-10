# AI Mock Interview Platform

**Event:** UpSkill India Challenge – Techfest IIT Bombay 2025
**Team:** Fantastic Four

![Project Status](https://img.shields.io/badge/Status-Live-success) ![Tech Stack](https://img.shields.io/badge/Stack-Next.js%20%7C%20FastAPI%20%7C%20Gemini%20Flash-blue)

A real-time, voice-enabled AI system designed to simulate professional technical interviews. The platform leverages Large Language Models (LLMs) and Speech-to-Text (STT) technology to generate dynamic, role-specific questions and provide structured, objective feedback for career readiness.

---

## Project Overview

Traditional mock interviews suffer from inconsistency, high costs, and a lack of personalized, objective metrics. Our platform addresses this gap by delivering a scalable, fully automated interview experience that mimics a human "Bar Raiser" interviewer.

### Key Features
* **Real-time Voice Interaction:** Users speak their answers naturally; the system transcribes audio and responds with context-aware follow-up questions.
* **Dynamic Context:** The AI remembers conversation history, asking harder questions when you answer correctly and digging deeper when you are vague.
* **Structured Evaluation:** Post-interview, users receive a detailed JSON report card scoring **Technical Accuracy**, **Communication Clarity**, and **Problem Solving Depth**.
* **Role Specificity:** Supports tailored tracks for Data Analysts, Machine Learning Engineers, and Cybersecurity experts.

---

##  Architecture Overview

The system follows a decoupled **microservices architecture** to ensure scalability and separation of concerns.

```mermaid
graph LR
    User["User (Browser)"] -- "Audio/Voice" --> Frontend["Next.js Frontend (Netlify)"]
    Frontend -- "API Requests (Proxy)" --> Backend["FastAPI Backend (Render)"]
    Backend -- "Auth/Storage" --> Firebase[("Firebase Firestore")]
    Backend -- "Generation/Eval" --> AI["Gemini 2.0 Flash API"]