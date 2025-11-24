def combine_scores(semantic_scores: dict, audio_features: dict) -> dict:
    """
    Combine semantic (LLM) scores with audio features (if any).
    Week1: simple weighted average; refine in Week2.
    """
    tech = semantic_scores.get("technical_correctness", 0)
    prob = semantic_scores.get("problem_solving", 0)
    comm = semantic_scores.get("communication", 0)
    filler_rate = audio_features.get("filler_rate", 0.05)
    
    adj = max(0, 1 - filler_rate)
    final_score = round(((tech * 0.5) + (prob * 0.25) + (comm * 0.25)) * adj, 2)
    return {
        "technical_correctness": tech,
        "problem_solving": prob,
        "communication": comm,
        "final_score": final_score,
        "evidence_snippets": semantic_scores.get("evidence_snippets", [])
    }
