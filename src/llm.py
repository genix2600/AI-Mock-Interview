import os
import json
import re
from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()

# --- 1. Client Initialization ---
try:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print("WARNING: GEMINI_API_KEY not found in environment variables.")
        client = None
    else:
        client = genai.Client(api_key=api_key)
except Exception as e:
    print(f"LLM Initialization Error: {e}")
    client = None

# --- Helper: Clean JSON Markdown ---
def clean_json_text(text: str) -> str:
    """Removes markdown code blocks if the LLM adds them."""
    cleaned = text.strip()
    if cleaned.startswith("```"):
        cleaned = re.sub(r"^```(\w+)?", "", cleaned)
        cleaned = re.sub(r"```$", "", cleaned)
    return cleaned.strip()

# --- 2. Interviewer Logic (Question Generation) ---

def generate_contextual_question(
    role: str, 
    history: list[dict] = None, 
    difficulty: str = "Medium", 
    job_description: str = ""
) -> str:
    """
    Generates the next interview question based on Role, Difficulty, and JD.
    """
    if client is None:
        return "Error: AI Service Unavailable. Please check backend logs."

    # Format history for context
    conversation_text = ""
    if history:
        for turn in history:
            conversation_text += f"Interviewer: {turn.get('Q', '')}\nCandidate: {turn.get('A', '')}\n"

    # Context String
    jd_context = f"Focus strictly on these key skills/scope: {job_description}" if job_description else "Focus on core concepts for this role."
    
    # Dynamic System Instruction
    if not history:
        # START PHASE
        system_instruction = (
            f"You are a strict technical interviewer for a {role} position. "
            f"Difficulty Level: {difficulty}. "
            f"{jd_context} "
            "Start with a foundational question related to the job scope. "
            "Do not greet. Go straight to the question. Keep it under 2 sentences."
        )
        user_prompt = "Start the interview."
    else:
        # FOLLOW-UP PHASE
        system_instruction = (
            f"You are a technical interviewer for a {role} position. "
            f"Current Difficulty: {difficulty}. "
            f"{jd_context} "
            "Analyze the candidate's last answer. "
            "Rules:\n"
            "1. If the answer is vague, ask 'Why?' or 'How?'.\n"
            "2. If the answer is wrong, correct them briefly and move on.\n"
            "3. If the answer is good, increase the complexity based on the difficulty level.\n"
            "Output: JUST the question."
        )
        user_prompt = f"INTERVIEW HISTORY:\n{conversation_text}\n\nGenerate the next question."

    try:
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=[user_prompt],
            config=types.GenerateContentConfig(
                system_instruction=system_instruction,
                temperature=0.7, 
                max_output_tokens=150
            )
        )
        return response.text.strip()
    except Exception as e:
        print(f"Question Generation Error: {e}")
        return "Could you elaborate on your experience with these skills?"


# --- 3. Grader Logic (Evaluation) ---

def get_final_evaluation_json(
    role: str, 
    history: list[dict], 
    difficulty: str = "Medium", 
    job_description: str = ""
) -> dict:
    """
    Evaluates the session based on Role, Difficulty, and custom JD.
    """
    
    # --- GUARDRAIL: IMMEDIATE FAIL FOR SHORT SESSIONS ---
    if not history or len(history) < 2:
        return {
            "technical_score": 10,
            "clarity_score": 10,
            "fluency_score": 10,
            "detailed_feedback": "The interview was terminated too early. Please complete at least 2-3 questions next time.",
            "technical_strengths": ["N/A"],
            "technical_weaknesses": ["Session too short to evaluate"],
            "final_verdict": "Fail"
        }

    if client is None:
        return {
            "technical_score": 0, 
            "detailed_feedback": "AI Service Unavailable.", 
            "final_verdict": "Error",
            "technical_strengths": [],
            "technical_weaknesses": []
        }

    # Format transcript
    transcript = ""
    for idx, turn in enumerate(history):
        transcript += f"{idx+1}. Q: {turn.get('Q', '')}\n   A: {turn.get('A', '(No Answer provided)')}\n"

    jd_context = f"Candidate must demonstrate proficiency in: {job_description}" if job_description else ""

    # --- STRONG EVALUATION PROMPT ---
    system_instruction = (
        f"You are a 'Bar Raiser' Recruiter for a {role}. "
        f"Difficulty Expected: {difficulty}. "
        f"{jd_context} "
        "Evaluate the candidate based STRICTLY on the transcript provided. "
        "Do not hallucinate competence."
    )

    prompt = f"""
    TRANSCRIPT:
    {transcript}

    INSTRUCTIONS:
    1. SCORING RUBRIC (0-100) based on {difficulty} level expectations:
       - 0-30: Nonsense or completely wrong.
       - 31-60: Surface-level knowledge, major gaps.
       - 61-80: Solid answers, minor mistakes.
       - 81-100: Expert depth, covers edge cases.
    
    2. RULES:
       - If answers are one-word or off-topic, Technical Score MUST be < 30.
    
    OUTPUT FORMAT (JSON ONLY):
    {{
        "technical_score": (integer 0-100),
        "clarity_score": (integer 0-100),
        "fluency_score": (integer 0-100),
        "detailed_feedback": "A professional paragraph summarizing performance relative to the job description and difficulty level.",
        "technical_strengths": ["Specific Skill 1", "Specific Skill 2"],
        "technical_weaknesses": ["Specific Skill 1", "Specific Skill 2"],
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
                temperature=0.2
            )
        )
        
        cleaned_text = clean_json_text(response.text)
        result = json.loads(cleaned_text)
        return result

    except Exception as e:
        print(f"Evaluation Error: {e}")
        return {
            "technical_score": 0,
            "clarity_score": 0,
            "fluency_score": 0,
            "detailed_feedback": "Failed to generate report.",
            "technical_strengths": [],
            "technical_weaknesses": [],
            "final_verdict": "Error"
        }