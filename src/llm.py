import uuid

def generate_question_stub(role="data_analyst", difficulty="medium"):
    return {
        "question_id": uuid.uuid4().hex,
        "role": role,
        "difficulty": difficulty,
        "text": f"Explain PCA and when to use it (role={role}, difficulty={difficulty}).",
        "expected_points": ["reduce dimensionality", "variance explained", "eigenvectors"]
    }

def semantic_evaluate_stub(transcript: str, role: str = "data_analyst", question_id: str = None):
    return {
        "technical_correctness": 75,
        "problem_solving": 70,
        "communication": 80,
        "evidence_snippets": ["SAMPLE: 'we use PCA to reduce dimensionality'"]
    }
