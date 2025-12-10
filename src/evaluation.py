import os
import json
from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()

try:
    client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
except Exception as e:
    print(f"Eval Client Init Error: {e}")
    client = None

def get_final_evaluation_json(role: str, history: list[dict]) -> dict:
    """
    Generates the final strict evaluation report.
    Returns a Dictionary matching the frontend's expected JSON structure.
    """
    
    # --- 1. IMMEDIATE FAIL CONDITION ---
    # If the candidate answered fewer than 2 questions, don't even call the AI.
    if not history or len(history) < 2:
        return {
            "technical_score": 10,
            "clarity_score": 10,
            "fluency_score": 10,
            "detailed_feedback": "The interview was terminated too early. We need at least 2-3 answered questions to evaluate your technical skills properly.",
            "technical_strengths": ["N/A"],
            "technical_weaknesses": ["Session too short to evaluate"],
            "final_verdict": "Fail"
        }

    if client is None:
        return {"detailed_feedback": "AI Service Unavailable", "technical_score": 0}

    # Format Transcript
    transcript = ""
    for idx, turn in enumerate(history):
        transcript += f"{idx+1}. Q: {turn.get('Q', '')}\n   A: {turn.get('A', '(No Answer)')}\n"

    # --- 2. STRONG GRADING PROMPT ---
    system_instruction = (
        f"You are a 'Bar Raiser' Hiring Committee member evaluating a {role}. "
        "Your job is to strictly grade this transcript using a high standard. "
        "Do not be polite. Be accurate."
    )

    prompt = f"""
    TRANSCRIPT:
    {transcript}

    GRADING RUBRIC (0-100 scale):
    - Technical Score: Did they get the facts right? Did they understand the 'Why'? (0-40: Wrong, 41-70: Surface level, 71-100: Deep expertise)
    - Clarity Score: Did they communicate structured thoughts?
    - Fluency Score: Was the delivery confident and smooth?

    CRITICAL RULES:
    1. If the candidate gave 1-word answers, scores must be < 40.
    2. Identify 2 specific strengths and 2 specific weaknesses.
    3. The 'detailed_feedback' must be a professional paragraph summarizing the decision.

    OUTPUT FORMAT (Valid JSON):
    {{
        "technical_score": int,
        "clarity_score": int,
        "fluency_score": int,
        "detailed_feedback": "string",
        "technical_strengths": ["string", "string"],
        "technical_weaknesses": ["string", "string"],
        "final_verdict": "Strong Hire" | "Hire" | "Weak Hire" | "No Hire"
    }}
    """

    try:
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=[prompt],
            config=types.GenerateContentConfig(
                system_instruction=system_instruction,
                response_mime_type="application/json",
                temperature=0.2 # Low temp for consistent grading
            )
        )
        return json.loads(response.text)

    except Exception as e:
        print(f"Evaluation API Error: {e}")
        return {
            "technical_score": 0,
            "detailed_feedback": "Evaluation failed due to internal error.",
            "technical_strengths": [],
            "technical_weaknesses": [],
            "final_verdict": "Error"
        }