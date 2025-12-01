def transcribe_file(path: str) -> str:
    """
    Need to Replace with real Whisper integration in Week2.
    """
    try:
        txt_path = path + ".txt"
        with open(txt_path, "r", encoding="utf-8") as f:
            return f.read().strip()
    except Exception:
        return "This is a placeholder transcript. We need to replace with Whisper output."


# For testing purposes