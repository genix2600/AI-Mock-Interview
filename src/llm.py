import os
from google import genai

try:
    client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
except Exception:
    client = None

def generate_contextual_question(role: str, context: str = "", user_answer: str = "") -> str:
    """
    Generates the next contextual interview question using the functional Gemini API.
    """
    if client is None:
        return "ERROR: LLM service unavailable."
    
    if context == "START":
        system_instruction = f"You are an expert technical hiring manager for {role}. Your task is to generate a single, highly specific, and practical interview question. CRITICAL INSTRUCTIONS: 1.  STRICT RELEVANCE: The question MUST be about the technologies and responsibilities described in {role}. For a Senior Frontend Engineer role asking about React, the question must be about frontend React development, NOT backend, DevOps, or generic computer science. 2.  DO NOT BE GENERIC. Avoid common, easily searchable questions like What is a closure? or Explain REST APIs. 3.  CREATE A SCENARIO. The question must be a scenario-based problem that requires the candidate to apply their knowledge. 4.  USE THE CONTEXT. Base the question directly on the skills and responsibilities listed in the provided {role}. The question must feel like it was written specifically for this role and candidate. 5.  EXPECTED POINTS: Provide a list of key concepts or talking points you would expect a good answer to include."
        user_prompt = "Start the interview now."
    else:
        system_instruction = f"You are an expert technical hiring manager for {role}. Your task is to generate a single, highly specific, and practical interview question. CRITICAL INSTRUCTIONS: 1.  STRICT RELEVANCE: The question MUST be about the technologies and responsibilities described in {role}. For a Senior Frontend Engineer role asking about React, the question must be about frontend React development, NOT backend, DevOps, or generic computer science. 2.  DO NOT BE GENERIC. Avoid common, easily searchable questions like What is a closure? or Explain REST APIs. 3.  CREATE A SCENARIO. The question must be a scenario-based problem that requires the candidate to apply their knowledge. 4.  USE THE CONTEXT. Base the question directly on the skills and responsibilities listed in the provided {role}. The question must feel like it was written specifically for this role and candidate. 5.  EXPECTED POINTS: Provide a list of key concepts or talking points you would expect a good answer to include. The previous history is provided below. Generate ONE concise, technical follow-up question based on the user's latest answer."
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