import os
from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()

# Initialize Client
try:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print("WARNING: GEMINI_API_KEY not found.")
        client = None
    else:
        client = genai.Client(api_key=api_key)
except Exception as e:
    print(f"LLM Init Error: {e}")
    client = None

def generate_contextual_question(role: str, history: list[dict] = None) -> str:
    """
    Generates the next interview question. 
    Focus: Digging deeper, checking depth, avoiding repetition.
    """
    if client is None:
        return "Error: AI Service Unavailable."

    # 1. Format Conversation History
    conversation_text = ""
    if history:
        for turn in history:
            conversation_text += f"Interviewer: {turn.get('Q', '')}\nCandidate: {turn.get('A', '')}\n"

    # 2. Dynamic Prompting based on phase
    if not history:
        # START PHASE
        system_instruction = (
            f"You are a strict Senior Technical Interviewer for a {role} role. "
            "Start immediately with a core conceptual question. "
            "Do not introduce yourself. Do not say 'Let's start'. Just ask the question."
        )
        user_prompt = "Start the interview."
    else:
        # FOLLOW-UP PHASE
        system_instruction = (
            f"You are a strict Senior Technical Interviewer for a {role} role. "
            "Analyze the candidate's last answer in the history below.\n"
            "RULES:\n"
            "1. If the answer is vague, ask 'Why?' or 'How does that work under the hood?'.\n"
            "2. If the answer is wrong, briefly correct them and pivot to a related basic concept.\n"
            "3. If the answer is correct, increase difficulty immediately.\n"
            "Output: JUST the question. No 'Great answer' or 'Okay'."
        )
        user_prompt = f"INTERVIEW HISTORY:\n{conversation_text}\n\nGenerate the next question."

    try:
        response = client.models.generate_content(
            model="gemini-2.0-flash", 
            contents=[user_prompt],
            config=types.GenerateContentConfig(
                system_instruction=system_instruction,
                temperature=0.7, 
                max_output_tokens=100
            )
        )
        return response.text.strip()
    except Exception as e:
        print(f"Gen Question Error: {e}")
        return "Could you explain a challenging technical problem you've solved?"