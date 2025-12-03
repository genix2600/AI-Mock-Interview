import os
from google import genai

try:
    client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
except Exception:
    client = None

def generate_question_stub(role: str, context: str = "", user_answer: str = "") -> str:
    """
    Generates the next contextual interview question using the Gemini API.
    """
    if client is None:
        return "ERROR: LLM service unavailable."

    if context == "START":
        system_instruction = f"You are a Senior Interviewer for a {role}. Start the interview with a foundational question."
        user_prompt = "Start the interview now."
    else:
        system_instruction = f"You are a Senior Interviewer for a {role}. The previous history is provided below. Generate ONE concise, technical follow-up question based on the user's latest answer."
        user_prompt = f"HISTORY: {context}\nUSER'S LAST ANSWER: {user_answer}\nGenerate the next question."
        
    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=[user_prompt],
            config=genai.types.GenerateContentConfig(
                system_instruction=system_instruction,
                temperature=0.8 
            )
        )
        return response.text.strip()
    except Exception as e:
        return f"ERROR: Question generation failed."