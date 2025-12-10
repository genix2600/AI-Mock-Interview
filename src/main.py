import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware 
from contextlib import asynccontextmanager
from src.routers import interview 
from src.database import initialize_firebase 
from dotenv import load_dotenv

load_dotenv() 

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Application Startup: Initializing services...")
    
    initialize_firebase()
    
    yield 
    print("Application Shutdown: Cleaning up resources...")

app = FastAPI(
    title="AI Mock Interview Platform API",
    version="0.1.0",
    lifespan=lifespan
)

origins = [
    "http://localhost:3000",                      # Local Development
    "http://127.0.0.1:3000",                      # Local Development (Alternative)
    "https://f4-ai-mock-interview.netlify.app",   # Your Netlify Frontend
    "https://f4-ai-mock-interview.netlify.app/"   # Trailing slash variant
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,      # Use the specific list
    allow_credentials=True,     # Verified safe with specific origins
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(interview.router)

@app.get("/health", tags=["Health"])
async def health():
    return {"status": "ok", "service": "AI Mock Interview Backend"}