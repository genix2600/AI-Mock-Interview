from fastapi import FastAPI
from contextlib import asynccontextmanager
from src.routers import interview 

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize services (Firebase, LLM clients, etc.) here
    print("Application Startup: Initializing services...")
    # TODO: Add Firebase initialization here
    yield
    # Shutdown: Clean up resources here
    print("Application Shutdown: Cleaning up resources...")

app = FastAPI(
    title="AI Mock Interview Platform API",
    version="0.1.0",
    lifespan=lifespan
)

# --- Include Routers ---
#Include all the endpoints from the router file
app.include_router(interview.router)

# --- Health Check Endpoint ---
# We keep the health check here or move it to the router (Keeping it simple for now)
@app.get("/health", tags=["Health"])
async def health():
    """API Health Check."""
    return {"status": "ok", "service": "AI Mock Interview Backend"}

# NOTE: All in-line Pydantic models (GenerateRequest, EvaluateRequest) and 
# all dedicated endpoint functions (transcribe_audio, generate_question, evaluate) 
# have been successfully moved to src/models.py and src/routers/interview.py.

#Remove the __main__ block as uvicorn should be run externally
# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run("src.main:app", host="0.0.0.0", port=8000, reload=True)