import sys
import os
from pathlib import Path

# Add current folder to sys.path to resolve sibling imports seamlessly
BACKEND_DIR = Path(__file__).resolve().parent
sys.path.append(str(BACKEND_DIR))

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
import uvicorn
import gradio as gr

# Sibling Imports from backend/ folder
import config
from generator import GroqPromptGenerator
from history import HistoryManager

# Initialize core modules
generator = GroqPromptGenerator()
history_db = HistoryManager()

# Create FastAPI app
app = FastAPI(
    title="PromptCraft AI Core API",
    description="Futuristic AI Prompt Generation SaaS REST Service",
    version="2.5"
)

# Enable CORS for local frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API Pydantic Schemas
class GenerateRequest(BaseModel):
    raw_idea: str
    category: str
    temperature: float = 0.7
    max_tokens: int = 1500
    selected_model: str = "llama-3.3-70b-versatile"

class RefineRequest(BaseModel):
    current_prompt: str
    feedback: str
    category: str
    temperature: float = 0.7
    max_tokens: int = 1500

# REST API ENDPOINTS
@app.get("/api/categories")
async def get_categories():
    """Returns categories configuration and metadata."""
    return config.CATEGORIES

@app.get("/api/system-status")
async def get_system_status():
    """Returns dynamic system parameters and status indicators."""
    return {
        "status": config.SYSTEM_STATUS,
        "models": config.MODEL_LIST,
        "active_model": config.PRIMARY_MODEL,
        "api_state": generator.get_system_status(),
        "time": sys_time_str()
    }

def sys_time_str():
    import time
    return time.strftime("%Y-%m-%d %H:%M:%S UTC")

@app.get("/api/history")
async def get_history():
    """Returns formatted prompt generation history database."""
    return history_db.load_history()

@app.post("/api/history/clear")
async def clear_history():
    """Flushes prompt generation logs."""
    history_db.clear_history()
    return {"message": "History Database successfully flushed."}

@app.post("/api/generate")
async def generate_prompt(req: GenerateRequest):
    """Triggers prompt generation pipeline using Groq fallback models."""
    if not req.raw_idea.strip():
        raise HTTPException(status_code=400, detail="Raw concept input cannot be empty.")
        
    prompt_out, model_used, status_msg = generator.generate_prompt(
        raw_idea=req.raw_idea,
        category=req.category,
        temperature=req.temperature,
        max_tokens=req.max_tokens,
        selected_model=req.selected_model
    )
    
    # Save to history if successful
    if not prompt_out.startswith("⚠️"):
        history_db.add_history(
            raw_idea=req.raw_idea,
            category=req.category,
            model=model_used,
            generated_prompt=prompt_out
        )
        
    return {
        "generated_prompt": prompt_out,
        "model_used": model_used,
        "status_message": status_msg
    }

@app.post("/api/refine")
async def refine_prompt(req: RefineRequest):
    """Iteratively refines prompt using user feedback."""
    if not req.feedback.strip():
        raise HTTPException(status_code=400, detail="Refinement feedback instruction cannot be empty.")
        
    prompt_out, model_used, status_msg = generator.refine_prompt(
        current_prompt=req.current_prompt,
        feedback=req.feedback,
        category=req.category,
        temperature=req.temperature,
        max_tokens=req.max_tokens
    )
    
    # Log refined prompt in history
    history_db.add_history(
        raw_idea=f"Refinement: {req.feedback[:20]}...",
        category=req.category,
        model=model_used,
        generated_prompt=prompt_out
    )
    
    return {
        "generated_prompt": prompt_out,
        "model_used": model_used,
        "status_message": status_msg
    }

# MOUNT MOUNT LEGACY GRADIO APP FOR DUAL DEPLOYMENT
try:
    from app import app as gradio_app
    app = gr.mount_gradio_app(app, gradio_app, path="/gradio")
    print("Mounted legacy Gradio utility successfully at /gradio")
except Exception as e:
    print(f"Warning: Could not mount legacy Gradio application: {e}")

# SERVE COMPILED REACT STATIC FRONTEND ASSETS
FRONTEND_DIST_DIR = Path(__file__).resolve().parent.parent / "frontend" / "dist"

if FRONTEND_DIST_DIR.exists():
    app.mount("/", StaticFiles(directory=str(FRONTEND_DIST_DIR), html=True), name="frontend")
    print(f"Mounted React compiled assets from {FRONTEND_DIST_DIR}")
    
    @app.exception_handler(404)
    async def custom_404_handler(request, __):
        """Fallback to React index.html for client-side routing support."""
        return FileResponse(FRONTEND_DIST_DIR / "index.html")
else:
    print(f"Warning: Frontend compiled static folder not detected at {FRONTEND_DIST_DIR}. Exposing API backend only.")

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
