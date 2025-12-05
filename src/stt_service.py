import os
import base64
import json
from google import genai
from google.genai.errors import APIError
from typing import Dict, Any

# Client initialization
try:
    client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
except Exception as e:
    print(f"Gemini Client Initialization Error: {e}")
    client = None


def parse_data_uri(data_uri: str) -> tuple[str, bytes]:
    """Parses a Base64 data URI to extract MIME type and raw bytes."""
    try:
        header, encoded_data = data_uri.split(';base64,', 1)
        mime_type = header.split(':', 1)[1]
        decoded_bytes = base64.b64decode(encoded_data)
        return mime_type, decoded_bytes
    except Exception:
        # Fallback if URI format is slightly off, assuming raw base64 might be passed or default audio
        return "audio/wav", base64.b64decode(data_uri.split(',')[-1])

def transcribe_and_analyze_audio(data_uri: str) -> Dict[str, Any]:
    """
    Transcribes audio using Gemini (Direct Bytes) and analyzes speech features.
    """
    if client is None:
        raise ConnectionError("Gemini client is not initialized. Check API key.")
        
    # 1. Parse Bytes directly (No file saving needed)
    mime_type, audio_bytes = parse_data_uri(data_uri)

    output_schema = {
        "type": "object",
        "properties": {
            "transcript": {"type": "string"},
            "speechRateWpm": {"type": "number"},
            "fillerRate": {"type": "number"}
        },
        "required": ["transcript", "speechRateWpm", "fillerRate"]
    }

    prompt_instruction = (
        "Transcribe the spoken audio provided. Then, analyze the speaker's fluency "
        "and pacing, and estimate the words per minute (WPM) and filler word rate. "
        "Return the result ONLY as a JSON object adhering to the provided schema."
    )

    try:
        # 2. Use from_bytes to send data directly from memory
        # This bypasses the 'from_file' error and is faster
        audio_part = genai.types.Part.from_bytes(data=audio_bytes, mime_type=mime_type)

        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=[audio_part, prompt_instruction],
            config=genai.types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=output_schema
            )
        )
        
        return json.loads(response.text)

    except APIError as e:
        raise ConnectionError(f"Gemini API Error during STT: {e}")
    except Exception as e:
        # This catches if 'from_bytes' also has issues or other logic fails
        raise Exception(f"STT Service Error: {e}")