import os
import json
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


# --- 2. Interviewer Logic (Question Generation) ---

def generate_contextual_question(role: str, history: list[dict] = None) -> str:
    """
    Generates the next interview question. 
    Persona: Strict Senior Engineer. Digs deeper, avoids fluff.
    """
    if client is None:
        return "Error: AI Service Unavailable. Please check backend logs."

    # Format history for context
    conversation_text = ""
    if history:
        for turn in history:
            conversation_text += f"Interviewer: {turn.get('Q', '')}\nCandidate: {turn.get('A', '')}\n"

    # Dynamic System Instruction
    if not history:
        # START PHASE
        system_instruction = (
            f"You are a strict, no-nonsense Senior Technical Interviewer for a {role} position. "
            "Start with a foundational but specific question to gauge the candidate's core understanding. "
            "Do not greet (e.g., no 'Hello', no 'Let's start'). Go straight to the question. "
            "Keep it under 2 sentences."
        )
        user_prompt = "Start the interview."
    else:
        # FOLLOW-UP PHASE
        system_instruction = (
            f"You are a strict Technical Interviewer for a {role} position. "
            "Analyze the candidate's last answer in the history below. "
            "Rules:\n"
            "1. If the answer was vague or short, ask a follow-up to dig deeper (e.g., 'Why?', 'How would that scale?').\n"
            "2. If the answer was wrong, briefly correct them and move to a different topic.\n"
            "3. If the answer was good, move to a significantly harder concept.\n"
            "Output: JUST the question. No 'Great answer' or 'Okay'."
        )
        user_prompt = f"INTERVIEW HISTORY:\n{conversation_text}\n\nGenerate the next question."

    try:
        response = client.models.generate_content(
            model="gemini-2.0-flash", # Use 2.0 Flash for speed/reasoning balance
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
        return "Could you elaborate on your experience with this tech stack?"


# --- 3. Grader Logic (Evaluation) ---

def get_final_evaluation_json(role: str, history: list[dict]) -> dict:
    """
    Evaluates the entire session and returns a JSON report.
    CRITICAL: Handles empty or short sessions strictly with automatic failure.
    """
    
    # --- GUARDRAIL: IMMEDIATE FAIL FOR SHORT SESSIONS ---
    # If the user answered fewer than 2 questions, automatic fail.
    if not history or len(history) < 2:
        return {
            "technical_score": 10,
            "clarity_score": 10,
            "fluency_score": 10,
            "detailed_feedback": "The interview was terminated too early. No substantial answers were recorded to evaluate technical skills. Please complete at least 2-3 questions next time.",
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

    # --- STRONG EVALUATION PROMPT (Rubric Based) ---
    system_instruction = (
        f"You are a 'Bar Raiser' Technical Recruiter hiring for a {role}. "
        "Evaluate the candidate based STRICTLY on the transcript provided. "
        "Do not hallucinate competence. If an answer is missing or nonsense, score it 0."
    )

    prompt = f"""
    TRANSCRIPT:
    {transcript}

    INSTRUCTIONS:
    1. SCORING RUBRIC (0-100):
       - 0-30: Nonsense, empty, or completely wrong answers.
       - 31-60: Surface-level knowledge, major gaps, used buzzwords without understanding.
       - 61-80: Solid answers, minor mistakes, good communication.
       - 81-100: Expert depth, covers edge cases, trade-offs, and internals.
    
    2. RULES:
       - If answers are one-word or off-topic, Technical Score MUST be < 30.
       - Be critical. High scores require depth (mentioning "Why" and "How").
    
    OUTPUT FORMAT (JSON ONLY):
    {{
        "technical_score": (integer 0-100),
        "clarity_score": (integer 0-100),
        "fluency_score": (integer 0-100),
        "detailed_feedback": "A professional paragraph summarizing performance, focusing on the gap between current level and senior level.",
        "technical_strengths": ["Specific Concept 1", "Specific Concept 2"],
        "technical_weaknesses": ["Specific Concept 1", "Specific Concept 2"],
        "final_verdict": "Strong Hire" | "Hire" | "Weak Hire" | "No Hire"
    }}
    """

    try:
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=[prompt],
            config=types.GenerateContentConfig(
                system_instruction=system_instruction,
                response_mime_type="application/json", # Forces JSON output
                temperature=0.2 # Low temperature for strict grading
            )
        )
        
        # Parse the JSON response
        result = json.loads(response.text)
        return result

    except Exception as e:
        print(f"Evaluation Error: {e}")
        return {
            "technical_score": 0,
            "clarity_score": 0,
            "fluency_score": 0,
            "detailed_feedback": "Failed to generate evaluation report due to an internal error.",
            "technical_strengths": [],
            "technical_weaknesses": [],
            "final_verdict": "Error"
        }
