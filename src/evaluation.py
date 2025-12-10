import os
import json
from google import genai
from google.genai.errors import APIError
from typing import Dict, Any

try:
    client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
except Exception as e:
    print(f"Gemini Client Initialization Error: {e}")
    client = None

def get_final_evaluation_json(role: str, full_transcript: str) -> Dict[str, Any]:
    """
    Calls the Gemini API to generate the structured EvaluationReport JSON.
    """
    if client is None:
        raise ConnectionError("Gemini client is not initialized.")
        
    prompt = f"""You are an impartial Senior Technical Interview Evaluator for the '{role}' role.
    Analyze the entire conversation transcript below and generate a STRICT JSON evaluation report.
    
    SCORING CRITERIA (0-10): Technical correctness, communication clarity, and fluency.
    
    TRANSCRIPT: ---{full_transcript}---
    
    You MUST respond ONLY with a single JSON object that adheres exactly to the required EvaluationReport schema.
    """

    output_schema = {
        "type": "object",
        "properties": {
            "technical_score": {"type": "number"},
            "clarity_score": {"type": "number"},
            "fluency_score": {"type": "number"},
            "detailed_feedback": {"type": "string"},
            "technical_strengths": {"type": "array", "items": {"type": "string"}},
            "technical_weaknesses": {"type": "array", "items": {"type": "string"}}
        },
        "required": ["technical_score", "clarity_score", "fluency_score", "detailed_feedback", "technical_strengths", "technical_weaknesses"]
    }
    
    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=[prompt],
            config=genai.types.GenerateContentConfig(
                temperature=0.0,
                response_mime_type="application/json",
                response_schema=output_schema
            )
        )
        return json.loads(response.text)

    except APIError as e:
        raise Exception(f"Gemini API Evaluation failed: {e}")
    except Exception as e:
        raise Exception(f"Evaluation failed: {e}")