from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware 
from contextlib import asynccontextmanager
from src.routers import interview 
from src.database import initialize_firebase 
from dotenv import load_dotenv
import os

load_dotenv() 

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Application Startup: Initializing services...")
    if os.getenv('FIREBASE_SERVICE_ACCOUNT_PATH'):
        initialize_firebase()
    else:
        print("WARNING: Skipping Firebase initialization.")
    yield 
    print("Application Shutdown: Cleaning up resources...")

app = FastAPI(
    title="AI Mock Interview Platform API",
    version="0.1.0",
    lifespan=lifespan
)

origins = [
    "http://localhost:3000",
    "http://192.168.56.1:3000",
    "https://f4-ai-mock-interview.netlify.app/",
    "*"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(interview.router)

@app.get("/health", tags=["Health"])
async def health():
    return {"status": "ok", "service": "AI Mock Interview Backend"}