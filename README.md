# 🚀 PromptCraft AI // ULTRA-PREMIUM CYBERPUNK AI Prompt SaaS

`PromptCraft AI` is an elite, production-ready, billion-dollar startup-level AI Prompt SaaS application designed with a **highly immersive cyberpunk AI operating system (Jarvis-style)** theme. 

It completely transforms simple raw ideas into cinematic, structured, and production-grade "Master Prompts" optimized for advanced LLMs (GPT-4, Claude 3.5, Llama 3, Midjourney, and more).

---

## 🎨 Immersive Cyberpunk visual Showcase
*   **Rotating Holographic AI Brain**: A massive, infinitely rotating SVG neural core in the top right, complete with tilted orbital rings, volumetric neon glows, and custom SVG filters.
*   **Glassmorphic Left Sidebar**: Floating navigation tabs that emit a blue-purple hover glow, custom sidebar icons, dark mode toggles, and a glowing neon premium Upgrade Card.
*   **Interactive Workspace Decks**: 10 clickable category cards (UI/UX, Coding, AI Agent, Logo, Game Design, Thumbnail, 3D Art, Marketing, Startup, Video Generation) that transition the active page dynamically into tailored workspace templates.
*   **Cockpit Stats Cards**: 4 glassmorphic visual widgets tracking prompts generated, time saved, ideas enhanced, and accuracy using real-time SVG neon mini-graphs and counters.
*   **Holographic Output Panel**: Renders prompts using smooth markdown layouts, instant clipboard copying, and refinement input HUD systems.

---

## 📂 Architecture Structure

```
promtagent/
├── backend/                # FastAPI + Gradio API Server
│   ├── assets/             # Legacy styling files
│   ├── app.py              # Legacy Gradio Blocks Interface
│   ├── config.py           # Environmental settings & CSS loader
│   ├── generator.py        # Groq client, model fallbacks, category Prompts
│   ├── history.py          # Persistent history logs backend
│   └── main.py             # FastAPI entry point serving React + Gradio mounting
├── frontend/               # React + Tailwind + Framer Motion + GSAP
│   ├── dist/               # Compiled React production static files
│   ├── src/
│   │   ├── components/     # Holographic Brain, Sidebar, Stats Cards
│   │   ├── pages/          # Dashboard Panel, Workspace Panels
│   │   ├── App.jsx         # App router and global controllers
│   │   └── index.css       # Custom neon glows, scanlines, scrollbars
│   ├── package.json        # NPM dependencies
│   └── tailwind.config.js  # Neon color palettes and shadow filters
├── requirements.txt        # Stable Python dependencies (FastAPI, Gradio, Groq)
├── package.json            # Unified command scripts to launch monorepo
├── README.md               # User & Architecture guide
└── DEPLOYMENT.md           # Production deployment manual
```

---

## 🚀 Quick Start (Local Setup)

### 1. Configure Python Backend
Ensure Python 3.9+ is installed:
```bash
# Install stable production dependencies
python3 -m pip install -r requirements.txt
```

### 2. Configure Environment Credentials
Create a `.env` file in the root folder (or inside `backend/`):
```env
GROQ_API_KEY=gsk_your_groq_api_key_goes_here
```
*Note: If no Groq key is present, the app gracefully launches in offline high-fidelity simulation mode.*

### 3. Build & Compile React Frontend
Install npm dependencies and compile the production bundle:
```bash
# Build React
cd frontend
npm install
npm run build
cd ..
```

### 4. Launch Production Server
Spin up the unified FastAPI server:
```bash
python3 backend/main.py
```
Open **`http://localhost:8000`** in your browser to experience the cyberpunk dashboard!
*(Gradio utility continues to run successfully on `/gradio`)*
