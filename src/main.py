from fastapi import FastAPI
from contextlib import asynccontextmanager
from src.routers import interview 
from src.database import initialize_firebase 
from dotenv import load_dotenv
import os

load_dotenv() 

# --- Application Lifespan Context ---
@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Handles startup and shutdown events for the application, initializing services.
    """
    print("Application Startup: Initializing services...")
    
    # Initialize Firebase using the environment variable path
    if os.getenv('FIREBASE_SERVICE_ACCOUNT_PATH'):
        initialize_firebase()
    else:
        print("WARNING: Skipping Firebase initialization (FIREBASE_SERVICE_ACCOUNT_PATH not set).")
    
    yield # Application serves requests here
    
    print("Application Shutdown: Cleaning up resources...")

app = FastAPI(
    title="AI Mock Interview Platform API",
    version="0.1.0",
    lifespan=lifespan
)

app.include_router(interview.router)

# --- Health Check Endpoint ---
@app.get("/health", tags=["Health"])
async def health():
    """API Health Check."""
    return {"status": "ok", "service": "AI Mock Interview Backend"}

# NOTE: The execution is handled by 'uvicorn src.main:app --reload'