import os
from pathlib import Path
from dotenv import load_dotenv

# Load environmental variables from .env file
load_dotenv()

# BASE DIRECTORY DEFINITIONS
BASE_DIR = Path(__file__).resolve().parent
STYLE_CSS_PATH = BASE_DIR / "assets" / "style.css"

# GROQ API SETTINGS
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")

# 2-TIER MODEL DEPLOYMENT (Ordered from Primary to Secondary)
PRIMARY_MODEL = "llama-3.3-70b-versatile"
SECONDARY_MODEL = "deepseek-r1-distill-llama-70b"

MODEL_LIST = [PRIMARY_MODEL, SECONDARY_MODEL]

# APP CONSTANTS
APP_TITLE = "PROMPT_FORGE"
APP_SUBTITLE = "ANTI-GRAVITY AI // ADVANCED PROMPT SYNTHESIZER"
SYSTEM_STATUS = "SYSTEM OPERATIONAL // CORE ONLINE"

# CATEGORIES CONFIGURATION WITH FUTURE-THEMED METADATA & SAMPLE IDEAS
CATEGORIES = {
    "UI/UX": {
        "icon": "🎨",
        "description": "Premium User Interfaces & Immersive Web Layouts",
        "samples": [
            "A glassmorphic dashboard for a quantum computing server monitoring status",
            "A futuristic mobile banking app interface with holographic transitions",
            "A cyberpunk-inspired flight booking terminal with neon accents"
        ]
    },
    "Coding": {
        "icon": "💻",
        "description": "Production-Grade Code, Scripts, and System Architecture",
        "samples": [
            "A Python script implementing an asynchronous web-scraper using HTTPX",
            "A robust FastAPI server template with OAuth2 authentication and Redis caching",
            "A clean React hook that handles WebSocket reconnections with exponential backoff"
        ]
    },
    "AI Agent": {
        "icon": "🤖",
        "description": "Intelligent Autonomous Workflows & Persona Definitions",
        "samples": [
            "An autonomous customer support agent managing ticket routing and API requests",
            "A multi-agent orchestrator that splits research tasks and synthesizes reports",
            "An elite security compliance auditing agent checking code for CVE exploits"
        ]
    },
    "Logo Design": {
        "icon": "⚡",
        "description": "Iconic, Scalable, Minimalist, and Dynamic Branding Assets",
        "samples": [
            "A vector logo design for an aerospace startup called 'Vortex Orbital' - sleek and modern",
            "A geometric neon logo for a cyberpunk indie gaming studio - glowing blue and violet",
            "A minimal abstract emblem representing artificial consciousness and flow state"
        ]
    },
    "Game Design": {
        "icon": "🎮",
        "description": "Immersive Gameplay Mechanics, Questlines, and Level Design",
        "samples": [
            "A comprehensive quest structure for a futuristic neo-noir RPG detective investigation",
            "A combat and progression balance spreadsheet formula for a space dogfighting simulator",
            "An environmental level design layout for an abandoned bio-dome on Mars"
        ]
    },
    "Thumbnail Design": {
        "icon": "🖼️",
        "description": "High Click-Through-Rate YouTube/Twitch Media Mockups",
        "samples": [
            "A high-contrast YouTube thumbnail showing a developer glowing under neon monitor light",
            "An epic sci-fi tech reviewer thumbnail showing futuristic holographic goggles",
            "A dramatic thumbnail layout featuring AI robots fighting with glowing cyan accents"
        ]
    },
    "Video Generation": {
        "icon": "🎬",
        "description": "Cinematic Director Scripts, Storyboards, and Motion Prompts",
        "samples": [
            "A 10-second cinematic drone shot flying over a neon-drenched dystopian cityscape",
            "An ultra-detailed cinematic transition zooming into the microchip of a supercomputer",
            "An abstract liquid gold motion-graphic background pulsing to deep ambient synthwave"
        ]
    },
    "3D Art": {
        "icon": "📐",
        "description": "Photorealistic Renders, Octane/Blender Shaders, and CAD Assets",
        "samples": [
            "A photorealistic 3D render of a futuristic glass sphere filled with glowing neon neon mist",
            "An isometric 3D game asset of a cybernetic research console - octane render",
            "A high-fidelity mechanical wristwatch with visible holographic gears - 4K unreal engine"
        ]
    },
    "Marketing": {
        "icon": "📈",
        "description": "Viral Copywriting, SaaS Copy, Ads, and Interactive Campaigns",
        "samples": [
            "A viral product launch sequence for an AI-powered automated video editor on X/Twitter",
            "A persuasive landing page hero section structure for a productivity SaaS tool",
            "High-converting email copy for a newsletter targeting tech-savvy early-adopter engineers"
        ]
    },
    "Startup Ideas": {
        "icon": "💡",
        "description": "Highly Lucrative SaaS, Hardware, and Deep-Tech Pitches",
        "samples": [
            "A niche micro-SaaS utilizing computer vision to optimize vertical warehouse spaces",
            "A decentralized energy-grid sharing network using smart contracts",
            "An AI-powered local-first personal knowledge management database that learns user habits"
        ]
    }
}

def load_css() -> str:
    """Safely loads custom CSS rules from assets/style.css."""
    if STYLE_CSS_PATH.exists():
        try:
            with open(STYLE_CSS_PATH, "r", encoding="utf-8") as f:
                return f.read()
        except Exception as e:
            print(f"Error loading custom CSS: {e}")
            return ""
    else:
        print(f"Warning: Custom CSS file not found at {STYLE_CSS_PATH}")
        return ""
