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
        
    prompt = f"""You are an expert interview evaluator and career coach. Your task is to provide a comprehensive evaluation of a candidate's answer during a mock interview.

**CONTEXT:**
- **Key points the candidate should have mentioned:**
{{#each expected_points}}
{{/each}}
- **TRANSCRIPT: ---{full_transcript}---

**EVALUATION INSTRUCTIONS:**
1.  **Score Rubrics:** Based on the transcript, provide a score from 0 to 100 for each of the following rubrics: 'technical_correctness', 'problem_solving', and 'communication'.
2.  **Explainable Feedback:** For each rubric, you MUST provide:
    *   **Comments:** Constructive feedback explaining the score.
    *   **Evidence:** Quote one or two short, specific phrases from the transcript that justify your comments. If there is no direct evidence, leave the array empty.
3.  **Learning Plan:** Based on the candidate's performance, create a concise, actionable 'learning_plan'.
    *   **improvement_points:** Provide 2-3 specific, actionable bullet points for how the candidate can improve.
    *   **learning_resources_keywords:** Suggest 2-3 search keywords or phrases the candidate can use to find relevant learning materials (e.g., "React custom hooks", "CSS Flexbox layout").

   
    
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