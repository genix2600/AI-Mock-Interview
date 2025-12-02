import os
import base64
import json
import uuid
from google import genai
from google.genai.errors import APIError
from typing import Dict, Any

# Client initialization should happen outside the function for efficiency
try:
    client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
except Exception as e:
    print(f"Gemini Client Initialization Error: {e}")
    client = None


def parse_data_uri(data_uri: str) -> tuple[str, bytes]:
    """Parses a Base64 data URI to extract MIME type and raw bytes."""
    header, encoded_data = data_uri.split(';base64,', 1)
    mime_type = header.split(':', 1)[1]
    decoded_bytes = base64.b64decode(encoded_data)
    return mime_type, decoded_bytes

def transcribe_and_analyze_audio(data_uri: str) -> Dict[str, Any]:
    """
    Transcribes audio using Gemini and simultaneously analyzes speech features.
    Returns a dictionary matching the TranscribeSpokenAnswersOutputSchema structure.
    """
    if client is None:
        raise ConnectionError("Gemini client is not initialized. Check API key.")
        
    mime_type, audio_bytes = parse_data_uri(data_uri)

    # Temporary file creation to handle audio input for the Python SDK
    temp_file_name = f"temp_audio_{uuid.uuid4().hex}"
    with open(temp_file_name, 'wb') as f:
        f.write(audio_bytes)
    
    output_schema = {
        "type": "object",
        "properties": {
            "transcript": {"type": "string"},
            "speechRateWpm": {"type": "number", "description": "Estimated words per minute."},
            "fillerRate": {"type": "number", "description": "Rate of filler words (um, uh, like) on a scale of 0.0 to 1.0."}
        },
        "required": ["transcript", "speechRateWpm", "fillerRate"]
    }

    prompt_instruction = (
        "Transcribe the spoken audio provided. Then, analyze the speaker's fluency "
        "and pacing, and estimate the words per minute (WPM) and filler word rate. "
        "Return the result ONLY as a JSON object adhering to the provided schema."
    )

    try:
        audio_part = genai.types.Part.from_file(path=temp_file_name, mime_type=mime_type)

        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=[audio_part, prompt_instruction],
            config=genai.types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=output_schema
            )
        )
        
        os.remove(temp_file_name)

        return json.loads(response.text)

    except APIError as e:
        os.remove(temp_file_name) if os.path.exists(temp_file_name) else None
        raise ConnectionError(f"Gemini API Error during STT: {e}")
    except Exception as e:
        os.remove(temp_file_name) if os.path.exists(temp_file_name) else None
        raise Exception(f"STT Service Error: {e}")