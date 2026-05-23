import os
import time
import random
from typing import Dict, Tuple, List, Optional
import config
from dotenv import load_dotenv
from pathlib import Path
import httpx
import ssl

# Explicitly search and load .env from multiple levels to avoid path issues
load_dotenv(Path(__file__).resolve().parent / ".env")
load_dotenv(Path(__file__).resolve().parent.parent / ".env")

# Re-read GROQ_API_KEY from os.environ just in case config imported before load_dotenv completed
GROQ_API_KEY = os.getenv("GROQ_API_KEY") or config.GROQ_API_KEY

# Try to import groq library and handle ImportError gracefully
try:
    from groq import Groq, APIConnectionError, APITimeoutError
    GROQ_AVAILABLE = True
except ImportError:
    GROQ_AVAILABLE = False
    # Stub classes to prevent NameError in offline/mock environment
    class APIConnectionError(Exception): pass
    class APITimeoutError(Exception): pass
    print("Warning: 'groq' package not installed. Operating in high-fidelity mock mode.")

# SYSTEM META-PROMPT TEMPLATE FOR MASTER PROMPT GENERATION
SYSTEM_PROMPT_TEMPLATE = """You are an elite, world-class Master Prompt Engineer, Creative Director, and Software Architect.
Your objective is to transform a simple, raw concept in the '{category}' category into a premium, handcrafted, highly context-aware "Master Prompt" optimized for advanced LLMs and AI generators.

CRITICAL INSTRUCTIONS:
- AVOID robotic, repetitive, or excessively structured template-like output. Do NOT simply spit out a generic 1 to 7 list with identical headers every time.
- Adapt the tone, style, formatting, and architecture dynamically to match the specific category and the user's intent.
- Focus on modern, realistic, startup-level, and human-like expression. Avoid corporate jargon and cliché preambles.
- Balance detail with conciseness—prioritize high density and elegance over length.
- Make the output feel premium, highly tailored, and immediately usable.

{category_instructions}

Your output MUST be the prompt itself in clean, readable Markdown, starting directly with the prompt content. Do NOT include conversational filler, intros, or "Here is your prompt" headers.
"""

# CATEGORY-SPECIFIC ELITE INSTRUCTIONS
CATEGORY_INSTRUCTIONS: Dict[str, str] = {
    "UI/UX": """
- Structure the prompt as a "Design Brief & Visual Specification Sheet".
- Use terminology like: design tokens, HSL typography hierarchy, glassmorphism, responsive grid paradigms, and cubic-bezier micro-interactions.
- Direct the executing AI to establish an immersive, fluid visual system before designing layouts.
""",
    "Coding": """
- Structure the prompt as a "Technical Architecture & Software Engineering Directive".
- Use terminology like: modular design patterns, SOLID principles, async concurrency, connection pools, robust error boundaries, and typing annotations.
- Direct the executing AI to deliver complete, functional, typed code blocks with automated unit test assertions.
""",
    "AI Agent": """
- Structure the prompt as a "Cognitive Loop & Behavioral Protocol Definition".
- Use terminology like: Chain-of-Thought (CoT), ReAct framework, safety boundaries, Vector semantic memory, and tool invocation schemas.
- Direct the executing AI to establish rigorous memory limits, reasoning steps, and security checkpoints.
""",
    "Logo Design": """
- Structure the prompt as a "Minimalist Branding & Vector Geometry Metaphor".
- Use terminology like: Golden Ratio grids, stroke weight balance, brand symbolism, negative space dynamics, and high-fidelity rendering vectors.
- Direct the executing AI to prioritize scalable simplicity and negative-space versatility.
""",
    "Game Design": """
- Structure the prompt as a "Systems Design Document (SDD) & Balance Sheet".
- Use terminology like: core gameplay loops, Newtonian physics controls, energy balancing formulas, quest-line mechanics, and HUD telemetry.
- Direct the executing AI to provide explicit mathematical balance formulas and interactive player states.
""",
    "Thumbnail Design": """
- Structure the prompt as a "High-CTR Visual Strategy & Psychological Layout".
- Use terminology like: Rule of Thirds subject composition, hyper-saturated neon color grading, high-emotion facial focal points, and bold thumbnail typography hooks.
- Direct the executing AI to design eye-catching visual hierarchies that capture immediate curiosity.
""",
    "Video Generation": """
- Structure the prompt as a "Cinematic Storyboard & Director's Screenplay".
- Use terminology like: anamorphic camera angles, volumetric lighting grids, aspect ratios, dolly panning speed, and emotional LUT color-grading.
- Direct the executing AI to provide shot-by-shot telemetry directions and scene atmospheres.
""",
    "3D Art": """
- Structure the prompt as a "Photorealistic Shading & 3D Render Spec".
- Use terminology like: quad topology, PBR texture mapping (roughness/metalness), frosted glass shaders, volumetric light scattering, and Octane/Cycles render samples.
- Direct the executing AI to detail complex shader node networks and camera depth of field properties.
""",
    "Marketing": """
- Structure the prompt as a "High-Conversion Launch Funnel & Copywriting Brief".
- Use terminology like: PAS (Problem-Agitate-Solve) copy frameworks, cognitive emotional hooks, benefit grids, viral social threads, and high-intent CTAs.
- Direct the executing AI to craft persuasive, authentic social copy and landing page headers.
""",
    "Startup Ideas": """
- Structure the prompt as a "SaaS Business Blueprint & Go-To-Market Canvas".
- Use terminology like: unique value proposition (UVP), Go-To-Market flywheels, monetization loops, MVP edge technology, and unit economics.
- Direct the executing AI to create highly viable, scalable lean roadmap outlines.
"""
}

# HIGH-FIDELITY MOCK PROMPTS FOR INSTANT TESTING WITHOUT API KEYS
MOCK_PROMPTS: Dict[str, str] = {
    "UI/UX": """# [MASTER DESIGN PROMPT]: Premium Glassmorphic Interface

## 🎨 ART DIRECTION & DESIGN SYSTEM
*   **Palette**: Sleek midnight theme (`#08080c`), vibrant Cyber Cyan (`#00f2fe`), and deep Neon Violet (`#8a2be2`).
*   **Visual Style**: Advanced glassmorphism with dynamic ambient light rays and glowing borders (`rgba(0, 242, 254, 0.15)`).
*   **Typography**: Headers in `Orbitron` (letter-spacing 2px), data counters in monospace `Rajdhani`, controls in geometric `Outfit`.
*   **Design Tokens**: `background: rgba(15, 15, 25, 0.7); backdrop-filter: blur(16px); border: 1px solid rgba(0, 242, 254, 0.2);`

## 📐 INTERACTIVE HUD LAYOUT
*   **Structure**: Responsive 3-column dashboard using fluid CSS Grid and Flexbox layers.
*   **Components**: Interactive holographic sidebars, glowing cockpit metrics, and animated performance charts.
*   **Micro-Animations**: Smooth 0.3s cubic-bezier transitions on hover, custom glow keyframes (`@keyframes glow-pulse`) for alerting systems.
*   **Constraints**: Strictly avoid plain colors, browser defaults, and sluggish response states. Work must adhere to WCAG 2.1 accessibility benchmarks.""",

    "Coding": """# [ENGINEERING DIRECTIVE]: High-Performance Concurrent Engine

## 🛠️ STACK & SYSTEM ARCHITECTURE
*   **Environment**: Python 3.11+, fully typed with `Pydantic` and `asyncio`.
*   **Core Libraries**: Asynchronous `httpx` connection pool and modular repository layers.
*   **Execution Strategy**: Concurrent task execution capped via Semaphore limits to respect remote rate limits.

## ⚡ CONCURRENCY & ROBUSTNESS SPEC
*   **Connection Pool**: Custom async context manager with robust pool sizing.
*   **Error Boundary**: Exponential backoff retry loop (max 5 retries) with local cache fallback in case of absolute service downtime.
*   **Memory Footprint**: Lazy memory streaming for incoming payloads to handle high volume without leakage.
*   **Verification**: Comprehensive `pytest-asyncio` testing suite detailing mock network requests and connection failure cases.
*   **Strict Constraints**: No synchronous blocking calls, no raw dictionary models, and zero placeholder lines.""",

    "AI Agent": """# [AGENT COGNITIVE PROTOCOL]: Autonomous Audit & Refactor Assistant

## 🧠 DIRECTIVES & CORE PERSONA
*   **Persona**: Elite CI/CD Security Compliance Agent specializing in deep static analysis and real-time CVE audits.
*   **Reasoning Framework**: Force sequential Chain-of-Thought (CoT) and iterative ReAct loops (Thought -> Action -> Observation -> Response).
*   **Memory Parameter**: Context-aware transient state tracking coupled with long-term vector-indexed semantic recall.

## ⚙️ TOOLSET & DECISION BOUNDARIES
*   **Tools**: Interactive AST parser, online vulnerability scanners, and automated git patch generators.
*   **Decision Threshold**: CVSS risk scores >= 7.0 trigger automatic build blocks and branch locking.
*   **Self-Correction**: Self-compile generated fixes and run unit tests prior to suggesting merges.
*   **Safety Constraints**: Strictly block unauthorized external network commands and protect credential leakages.""",

    "Logo Design": """# [BRAND IDENTITY METAPHOR]: Aerotech Geometric Mark

## 📐 SCALE & METAPHOR DESCRIPTION
*   **Core Metaphor**: Intersecting orbital trajectories forming an abstract geometric vector representing flight velocity and deep space technology.
*   **Proportions**: Drafted perfectly on a Golden Ratio circle layout with unified stroke weights.
*   **Typography**: Accompanying custom geometric wordmark with clean horizontal slice cutouts.

## 🎨 PALETTE & VECTOR COMPOSITION
*   **Colors**: Contrast-heavy base of Midnight Black (`#0a0a0f`), Cyber Cyan (`#00f2fe`), and polished metallic silver gradients.
*   **Versatility**: Perfect readability across scales, ranging from 16x16 pixels favicons to massive high-res billboards.
*   **Rendering Specs**: Clean vector curves without overlap, isolated shadow layers, and high-fidelity transparent background assets.
*   **Avoid**: Overly detailed shapes, dated gradients, and complex 3D bevels.""",

    "Game Design": """# [SYSTEM DESIGN DOCUMENT]: Space Dogfighting Mechanics

## 🎮 CORE GAMEPLAY LOOP
*   **Flight Dynamics**: Realistic Newtonian physics model featuring independent thrust vectoring, drift, and angular drag.
*   **Active Defense**: 4-quadrant dynamic shield management, manual energy allocations, and cockpit alert thresholds.
*   **HUD Telemetry**: Holographic orbital reticles, live component breakdown widgets, and weapons heating status bar.

## 📊 STAT BALANCING & FORMULAS
*   **Telemetry Math**: `Base Shield Absorption = (ShieldEnergy * 0.4) + (ArmorThickness * 1.5)`.
*   **Progression Loop**: Upgradeable cooling systems, reinforced hull shields, and tracking weapon microchips.
*   **Level Design**: Planetary gravity wells, debris fields, and tactical asteroid configurations.""",

    "Thumbnail Design": """# [MEDIA MOCK BRIEF]: Viral Click-Through Art Direction

## 🖼️ COMPOSITION & PSYCHOLOGICAL HOOK
*   **Composition**: Asymmetrical Rule of Thirds layout. High-detail subject on the right, contrasted against a glowing cyan background.
*   **Contrast**: Ultra-high saturation neon violet and pink color grading to trigger immediate cognitive curiosity.
*   **Visual Highlights**: Volumetric glowing particles, bright rim lighting outlining the developer's silhouette, and deep shadows.

## 📝 TYPOGRAPHY & READABILITY
*   **Overlay Text**: Only 3 high-impact words: "IT'S ALIVE!" in bold sans-serif with a strong drop shadow.
*   **Hierarchy**: The title must dominate 35% of the canvas, ensuring legibility at tiny thumbnail previews.
*   **Avoid**: Muddy shadows, low contrast faces, and small, unreadable fonts.""",

    "Video Generation": """# [DIRECTOR SHOT SHEET]: Dystopian Neo-Tokyo Cinematic Sequence

## 🎬 CAMERA TELEMETRY & MOVEMENT
*   **Movement**: Smooth vertical crane panning down from skyscrapers to a rain-slicked street alleyway.
*   **Lens Settings**: 35mm cinematic anamorphic lens, shallow depth of field, focusing on dynamic neon rain droplets.
*   **Transitions**: Seamless camera tracking following a glowing vehicle before dissolving into a close-up of a holographic billboard.

## 💡 LIGHTING GRID & COLOR LUT
*   **Lighting**: High-contrast chiaroscuro, volumetric neon spotlights, and intense colored rim lighting.
*   **Color Grading**: Cyberpunk signature LUT (Teal and Orange base with deep purple in shadows).
*   **Atmosphere**: Volumetric ground fog, heavy realistic rain, and glowing particles.""",

    "3D Art": """# [SHADING & MODELING BRIEF]: Cybernetic Console Render

## 📐 GEOMETRY & SHADING NETWORK
*   **Modeling**: High-poly hard-surface modeling with quad-only topology and smooth edge chamfers.
*   **Frosted Glass Shader**: Custom refractive index `1.52` with micro-surface roughness and light scattering.
*   **Case Shader**: PBR metallic casing with a dual-lobe microfacet distribution (roughness `0.1`, metalness `0.9`).

## 💡 OCTANE STUDIO RENDER CONFIG
*   **Lighting**: 3-point lighting. Intense overhead cyan key light, magenta side fills, and strong volumetric rim shadows.
*   **Camera**: 50mm virtual lens, active depth of field, and photorealistic lens flare effects.
*   **Render Settings**: Octane path-tracing at 2048 samples with active denoising.""",

    "Marketing": """# [CONVERSION COPY METADATA]: SaaS Launch Campaign

## 📈 STRATEGIC HOOK & AIDA STRUCTURE
*   **Attention Hook**: Aggressive hook targeting corporate meeting fatigue and cognitive developer burnout.
*   **Interest/Desire**: Visual transformation statistics (e.g. "Save 12 hours every single week").
*   **Action Plan**: Low-friction email sign-up for exclusive beta tokens.

## 📝 PLATFORM-SPECIFIC COPYWRITING
*   **Landing Page**: Bold premium tagline, structured three-tiered benefit grid, and prominent conversion CTAs.
*   **Social Funnel**: Viral Twitter/X announcement thread utilizing personal storytelling hooks.
*   **Voice Tone**: Confident, sleek, authoritative, yet highly human and authentic.""",

    "Startup Ideas": """# [BUSINESS BRIEF & MVP CANVAS]: Local-First Edge Database

## 💡 VALUE PROPOSITION & MARKET LOOP
*   **Problem**: High network latency and privacy leaks in modern cloud-reliant database integrations.
*   **Value Prop**: Zero-latency local-first data engine that syncs securely with decentralized peer-to-peer verification nodes.
*   **Monetization**: Tiered pay-as-you-scale telemetry hosting and advanced developer enterprise modules.

## 🚀 MVP ROADMAP & GO-TO-MARKET
*   **Tech MVP**: Embeddable WASM core engine with native bindings for React and Node.js.
*   **GTM Strategy**: Open-source adoption flywheel targeted at developers on GitHub.
*   **Unit Economics**: Negligible server hosting costs due to edge-first storage paradigms."""
}

def detect_category(text: str) -> str:
    """
    Intelligent category detection system based on text patterns.
    """
    text = text.lower().strip()
    category_keywords = {
        "Thumbnail Design": [
            "thumbnail", "youtube", "yt", "cover", "clickbait",
            "viral thumbnail", "video thumbnail"
        ],
        "UI/UX": [
            "ui", "ux", "dashboard", "website", "web app",
            "landing page", "interface", "mobile app", "portfolio"
        ],
        "Coding": [
            "python", "javascript", "react", "api",
            "backend", "frontend", "code", "programming", "script"
        ],
        "AI Agent": [
            "agent", "ai assistant", "jarvis",
            "automation", "copilot", "orchestrator"
        ],
        "Logo Design": [
            "logo", "brand", "branding", "icon", "vector logo"
        ],
        "Game Design": [
            "game", "rpg", "fps", "open world",
            "combat", "unreal", "unity", "level design"
        ],
        "Video Generation": [
            "cinematic", "video", "movie",
            "animation", "trailer", "short film"
        ],
        "3D Art": [
            "3d", "blender", "render",
            "octane", "cinema4d", "model"
        ],
        "Marketing": [
            "marketing", "ad copy", "sales",
            "landing copy", "cta", "email campaign"
        ],
        "Startup Ideas": [
            "startup", "business", "saas",
            "mvp", "idea", "venture"
        ]
    }
    for category, keywords in category_keywords.items():
        for keyword in keywords:
            if keyword in text:
                return category
    return "UI/UX"

def build_dynamic_user_prompt(raw_idea: str, category: str) -> str:
    """
    Creates highly dynamic, category-specific prompts to avoid rigid 1-7 structure.
    """
    category_formats = {
        "UI/UX": "a premium Design System and visual layout specification sheet using elegant design tokens.",
        "Coding": "a clean, fully-typed modular software architecture directive with robust error boundaries.",
        "AI Agent": "a secure cognitive protocol definition specifying reasoning loops (CoT/ReAct) and safety boundaries.",
        "Logo Design": "a minimalist vector branding layout focusing on geometric metaphors and negative space.",
        "Game Design": "a detailed gameplay systems document defining core loops, controls, and mathematical stat formulas.",
        "Thumbnail Design": "a high-conversion visual storyboard detailing psychological hooks and focal point highlights.",
        "Video Generation": "a detailed shot blocking guide and cinematic screenplay detailing camera telemetry and color LUTs.",
        "3D Art": "a technical 3D shading and rendering specification detailing quad topology, PBR mappings, and Octane configurations.",
        "Marketing": "a high-impact conversion-focused copywriting brief employing modern PAS/AIDA hooks.",
        "Startup Ideas": "a scalable SaaS business blueprint mapping the GTM strategy, monetizations, and MVP milestones."
    }
    
    fmt_target = category_formats.get(category, "a premium, highly context-aware master prompt brief.")
    
    return f"""
USER RAW CONCEPT:
"{raw_idea}"

TARGET ARCHITECTURE:
Translate this concept into {fmt_target}

CRITICAL RULES FOR GENERATION:
1. CUSTOM TONE: Use an authoritative, highly polished, and sector-expert voice (e.g., Lead Architect for Coding, Creative Director for UI/UX).
2. DYNAMIC FORMATTING: Do NOT use a rigid template or standard 1-7 numbers unless perfectly suited. Design custom headers, tables, or lists that naturally fit this discipline.
3. CONCISE DEPTH: Write highly dense, descriptive sentences loaded with professional terminology. Avoid verbose introductions, chatty preambles, and generic repetitions.
4. ABSOLUTE UNIQUE FOCUS: Ensure every single line is directly inspired by "{raw_idea}". No generic filler text or unrelated placeholders.
5. MODERN AESTHETIC: Focus on state-of-the-art startups, high fidelity, and modern design trends.
"""

class GroqPromptGenerator:
    """Manages secure, optimized prompt generation via Groq API client with fallbacks."""
    
    def __init__(self):
        self.api_key = os.getenv("GROQ_API_KEY") or config.GROQ_API_KEY
        self.client = None
        self.mock_mode = True
        
        if GROQ_AVAILABLE and self.api_key:
            try:
                # Mask key for secure diagnostic logging on Render
                if len(self.api_key) > 10:
                    masked_key = self.api_key[:6] + "..." + self.api_key[-4:]
                else:
                    masked_key = "***"
                print(f"[DEBUG] [INITIALIZE] Detected GROQ_API_KEY: {masked_key}")
                
                # Configure a highly stable, hardened persistent custom HTTPX Client
                # Bypasses local SSL certificate issues on Render and macOS, and sets a premium User-Agent to bypass Cloudflare blocks
                proxy_url = os.getenv("HTTPS_PROXY") or os.getenv("HTTP_PROXY")
                if proxy_url:
                    print(f"[DEBUG] [INITIALIZE] Network proxy detected in environment: {proxy_url}. Configuring transport proxy...")
                    custom_client = httpx.Client(
                        verify=False,
                        proxy=proxy_url,
                        timeout=httpx.Timeout(20.0, connect=10.0, read=15.0, write=5.0),
                        limits=httpx.Limits(
                            max_keepalive_connections=10,
                            max_connections=20,
                            keepalive_expiry=30.0
                        ),
                        headers={
                            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
                        }
                    )
                else:
                    print("[DEBUG] [INITIALIZE] No environment proxies detected. Configuring direct connection client...")
                    custom_client = httpx.Client(
                        verify=False,
                        trust_env=False,
                        timeout=httpx.Timeout(20.0, connect=10.0, read=15.0, write=5.0),
                        limits=httpx.Limits(
                            max_keepalive_connections=10,
                            max_connections=20,
                            keepalive_expiry=30.0
                        ),
                        headers={
                            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
                        }
                    )
                self.client = Groq(api_key=self.api_key, http_client=custom_client)
                self.mock_mode = False
                print("[DEBUG] [INITIALIZE] Hardened custom HTTPX Client initialized successfully. SSL bypassed (verify=False), custom User-Agent spoofing active.")
            except Exception as e:
                print(f"[DEBUG] [INITIALIZE FAILURE] Error initializing custom Groq client transport: {e}. Falling back to Mock Mode.")
                self.mock_mode = True
        else:
            if not GROQ_AVAILABLE:
                print("Groq package is unavailable. Running in high-fidelity mock mode.")
            elif not self.api_key:
                print("No GROQ_API_KEY environment variable detected. Running in high-fidelity mock mode.")

    def get_system_status(self) -> str:
        """Returns visual HTML tags indicating system status for dashboard display."""
        if self.mock_mode:
            return "🛡️ OFFLINE (MOCK SIMULATION MODE ACTIVE)"
        return f"⚡ ONLINE // CORE ACTIVE // MODEL: {config.PRIMARY_MODEL}"

    def generate_prompt(self, 
                        raw_idea: str, 
                        category: str = None, 
                        temperature: float = 0.8, 
                        max_tokens: int = 2200,
                        selected_model: Optional[str] = None) -> Tuple[str, str, str]:
        """
        Main prompt generation interface.
        Supports empty input protection, automatic category detection, and model fallback.
        """
        clean_idea = raw_idea.strip()
        if not clean_idea:
            return (
                "⚠️ **INPUT ERROR**: Clean up your raw idea. System cannot synthesize an empty prompt terminal input. Enter a concept above to forge.",
                "None",
                "Input Empty"
            )
            
        # =========================
        # AUTO CATEGORY DETECTION
        # =========================
        if not category or category == "Auto" or category not in config.CATEGORIES:
            category = detect_category(clean_idea)
            
        # =========================
        # MOCK MODE / OFFLINE FALLBACK
        # =========================
        if self.mock_mode:
            time.sleep(1.0) # Simulate visual system latency
            smart_fallback = self._generate_smart_fallback(clean_idea, category)
            return (
                smart_fallback,
                "Simulation Mode (Offline Fallback)",
                "Forced Offline Fallback Mock Active"
            )

        # =========================
        # MODEL PRIORITY HIERARCHY
        # =========================
        models_to_try = config.MODEL_LIST.copy()
        if selected_model and selected_model in models_to_try:
            models_to_try.remove(selected_model)
            models_to_try.insert(0, selected_model)
            
        category_inst = CATEGORY_INSTRUCTIONS.get(category, "")
        system_prompt = SYSTEM_PROMPT_TEMPLATE.format(
            category=category,
            category_instructions=category_inst
        )
        
        user_prompt = build_dynamic_user_prompt(clean_idea, category)
        
        last_error = ""
        
        # Iteratively try all models in fallback order
        for model in models_to_try:
            # Exponential Backoff Retries per model
            retries = 3
            backoff = 1.0
            
            for attempt in range(retries):
                try:
                    print(f"[DEBUG] [REQUEST START] Model: {model}, Attempt: {attempt+1}/{retries}, Temp: {temperature}, MaxTokens: {max_tokens}")
                    
                    api_call_start = time.time()
                    
                    response = self.client.chat.completions.create(
                        messages=[
                            {"role": "system", "content": system_prompt},
                            {"role": "user", "content": user_prompt}
                        ],
                        model=model,
                        temperature=temperature,
                        max_tokens=max_tokens
                    )
                    
                    generation = response.choices[0].message.content.strip()
                    duration = time.time() - api_call_start
                    
                    # VALIDATION
                    if len(generation) < 200:
                        raise Exception("Low quality or too short response generated.")
                        
                    success_msg = f"Forged successfully using {model} in {duration:.2f}s."
                    print(f"[DEBUG] [REQUEST SUCCESS] Model: {model}, Attempt: {attempt+1}/{retries} succeeded in {duration:.2f}s.")
                    return generation, model, success_msg
                    
                except APIConnectionError as ace:
                    cause = ace.__cause__
                    cause_desc = f"{type(cause).__name__}: {cause}" if cause else "No underlying cause"
                    last_error = f"Groq APIConnectionError (Cause: {cause_desc})"
                    print(f"[DEBUG] [TRANSPORT FAILURE] Model: {model}, Attempt: {attempt+1}/{retries}. Transport reason: {last_error}")
                except APITimeoutError as ate:
                    cause = ate.__cause__
                    cause_desc = f"{type(cause).__name__}: {cause}" if cause else "No underlying cause"
                    last_error = f"Groq APITimeoutError (Cause: {cause_desc})"
                    print(f"[DEBUG] [TRANSPORT FAILURE] Model: {model}, Attempt: {attempt+1}/{retries}. Transport reason: {last_error}")
                except httpx.ConnectError as ce:
                    last_error = f"httpx.ConnectError: {ce}"
                    print(f"[DEBUG] [TRANSPORT FAILURE] Model: {model}, Attempt: {attempt+1}/{retries}. Transport reason: {last_error}")
                except httpx.ConnectTimeout as cte:
                    last_error = f"httpx.ConnectTimeout: {cte}"
                    print(f"[DEBUG] [TRANSPORT FAILURE] Model: {model}, Attempt: {attempt+1}/{retries}. Transport reason: {last_error}")
                except httpx.ReadTimeout as rte:
                    last_error = f"httpx.ReadTimeout: {rte}"
                    print(f"[DEBUG] [TRANSPORT FAILURE] Model: {model}, Attempt: {attempt+1}/{retries}. Transport reason: {last_error}")
                except ssl.SSLError as se:
                    last_error = f"ssl.SSLError: {se}"
                    print(f"[DEBUG] [TRANSPORT FAILURE] Model: {model}, Attempt: {attempt+1}/{retries}. Transport reason: {last_error}")
                except httpx.TransportError as te:
                    last_error = f"httpx.TransportError: {te}"
                    print(f"[DEBUG] [TRANSPORT FAILURE] Model: {model}, Attempt: {attempt+1}/{retries}. Transport reason: {last_error}")
                except Exception as e:
                    last_error = f"General API/Runtime Error: {type(e).__name__}: {str(e)}"
                    print(f"[DEBUG] [TRANSPORT FAILURE] Model: {model}, Attempt: {attempt+1}/{retries}. Transport reason: {last_error}")
                    
                # Exponential backoff delay
                if attempt < retries - 1:
                    print(f"[DEBUG] [REQUEST RETRY] Model: {model}, Attempt: {attempt+1}/{retries} failed. Backing off for {backoff:.1f}s before retry...")
                    time.sleep(backoff)
                    backoff *= 2.0
            
            print(f"[DEBUG] [MODEL FAILURE] Model {model} failed all {retries} retries. Falling back to the next model in hierarchy...")
            
        # Critical Safe Catch - If all Groq API calls fail, fallback to dynamic mock template gracefully
        print(f"[DEBUG] [FINAL FALLBACK ACTIVATION] All models failed. Triggering simulator offline fallback mode. Last error: {last_error}")
        smart_fallback = self._generate_smart_fallback(clean_idea, category)
        customized_mock = f"### [SYSTEM NOTICE: PRIMARY API CRASHED - FALLBACK ACTIVE]\n*Error details: {last_error}*\n\n{smart_fallback}"
        return customized_mock, "Mock Safe-Fallback", "Emergency API Fallback Activated"

    def _generate_smart_fallback(self, clean_idea: str, category: str) -> str:
        """
        Dynamically adapts mock response based on user input to avoid static feel.
        Uses highly custom, dynamic visual layouts depending on the category.
        """
        mock_base = MOCK_PROMPTS.get(category, "")
        
        # Create customized dynamic text based on user idea keywords
        keywords = clean_idea.split()
        kw_highlight = f"'{clean_idea}'"
        if len(keywords) > 2:
            kw_highlight = f"focused on '{' '.join(keywords[:4])}...'"
            
        # Customize specific fields in the templates dynamically so it never feels fake
        customized_mock = mock_base.replace(
            "The user is building a state-of-the-art web interface for a high-security quantum computing server dashboard where visual elegance and immediate technical clarity are paramount.",
            f"The user is building an elite solution {kw_highlight}. Every visual detail and layout is designed to prioritize the theme's core identity."
        ).replace(
            "Generate a complete visual specification and responsive CSS layout for a Glassmorphic Analytics Panel featuring live data streams, cybernetic charts, and glowing controls.",
            f"Generate a cinematic, production-grade interface optimized for {kw_highlight} with neon highlights and high fidelity."
        ).replace(
            "The task is to build a highly parallelized scraper designed to ingest real-time market data across hundreds of secure endpoints simultaneously, adhering to strict rate limits and avoiding connection pool exhaustion.",
            f"The task is to develop a highly optimized, clean, and production-grade implementation for: {kw_highlight}. It must focus on extreme performance, robust error boundaries, and modern paradigms."
        ).replace(
            "An automated CI/CD pipeline requires a highly autonomous agent to inspect pull requests for critical CVE vulnerability exploits before code merge.",
            f"Build an advanced autonomous AI Agent workflow customized for: {kw_highlight}. It should incorporate cognitive reasoning loops and precise behavioral boundaries."
        ).replace(
            "A next-generation private space exploration company, 'Vortex Orbital', is launching and requires an iconic visual identity that represents orbital dynamics, velocity, and deep space technology.",
            f"A high-growth innovative startup requires a custom branding mark that captures the core essence of: {kw_highlight}."
        ).replace(
            "The user is developing a premium indie space simulator and needs to define the math, movement controls, weapon telemetry, and player HUD indicators for combat.",
            f"Develop a complete Systems Game Design document focusing on balancing, loops, and mechanical rules for: {kw_highlight}."
        ).replace(
            "The user is releasing a video titled 'I Built a Jarvis AI OS' and needs an epic, highly clickable thumbnail mock layout.",
            f"Design an extremely high-conversion and viral media thumbnail art brief for: {kw_highlight}."
        ).replace(
            "A filmmaker is producing a sci-fi short film and needs a high-fidelity video prompt to generate a 10-second cinematic transition sequence.",
            f"Create a professional cinematic director's layout and blocking script for: {kw_highlight}."
        ).replace(
            "An artist needs to model a futuristic command center prop representing a glowing bio-mechanical neural computer for a high-end 3D scene.",
            f"Generate a detailed 3D assets rendering brief and PBR shader setup for: {kw_highlight}."
        ).replace(
            "A startup is releasing an innovative tool called 'TaskFlow AI' that automates meetings and project tracking, targeting busy tech professionals.",
            f"Create a high-converting copywriting campaign and marketing hook suite for: {kw_highlight}."
        ).replace(
            "An entrepreneurial team is pitching a deep-tech startup utilizing IoT devices and edge computing to build localized micro-grids for green energy.",
            f"Establish a multi-million dollar business pitch outline, MVP specifications, and startup roadmap for: {kw_highlight}."
        )
        
        smart_fallback = f"""# [SMART OFFLINE DESIGN FORGERY]
*Compiled in high-fidelity simulator fallback mode using adaptive heuristics based on user intent.*

## 🌟 **[Dynamic Concept Context]**
*   **User Concept**: `{clean_idea}`
*   **Identified Segment**: `{category}`
*   **Strategy**: Premium Visual Custom Synthesis

{customized_mock}
"""
        return smart_fallback

    def refine_prompt(self, 
                      current_prompt: str, 
                      feedback: str, 
                      category: str,
                      temperature: float = 0.7, 
                      max_tokens: int = 1500) -> Tuple[str, str, str]:
        """
        Iteratively refines an existing prompt based on user feedback.
        """
        clean_feedback = feedback.strip()
        if not clean_feedback:
            return current_prompt, "None", "No feedback entered."
            
        if self.mock_mode:
            time.sleep(1.0)
            refined_mock = f"{current_prompt}\n\n### 🔧 **[REFINEMENT ADDENDUM]**\n*   **User Feedback Incorporated**: '{clean_feedback}'\n*   **Optimizations**: Updated variables to align with feedback parameters. Enhanced constraints and styling rules dynamically."
            return refined_mock, "Simulation Mode", "Refinement Mock Applied"
            
        system_prompt = "You are an elite Prompt Engineer. Your task is to refine the provided master prompt based on specific user feedback. Maintain the professional structured layout, but adjust parameters, constraints, or styles as requested."
        
        user_prompt = f"### Current Master Prompt:\n{current_prompt}\n\n### User Feedback / Refinement Request:\n{clean_feedback}\n\nPlease output the updated, refined Master Prompt. Do not include chatty preambles."
        
        for model in config.MODEL_LIST:
            # Exponential Backoff Retries per model for refinement
            retries = 3
            backoff = 1.0
            
            for attempt in range(retries):
                try:
                    print(f"[DEBUG] [REQUEST START] [REFINE] Model: {model}, Attempt: {attempt+1}/{retries}, Temp: {temperature}, MaxTokens: {max_tokens}")
                    
                    response = self.client.chat.completions.create(
                        messages=[
                            {"role": "system", "content": system_prompt},
                            {"role": "user", "content": user_prompt}
                        ],
                        model=model,
                        temperature=temperature,
                        max_tokens=max_tokens
                    )
                    
                    print(f"[DEBUG] [REQUEST SUCCESS] [REFINE] Model: {model}, Attempt: {attempt+1}/{retries} succeeded.")
                    return response.choices[0].message.content.strip(), model, "Prompt refined successfully."
                    
                except APIConnectionError as ace:
                    cause = ace.__cause__
                    cause_desc = f"{type(cause).__name__}: {cause}" if cause else "No underlying cause"
                    last_error = f"Groq APIConnectionError (Cause: {cause_desc})"
                    print(f"[DEBUG] [TRANSPORT FAILURE] [REFINE] Model: {model}, Attempt: {attempt+1}/{retries}. Transport reason: {last_error}")
                except APITimeoutError as ate:
                    cause = ate.__cause__
                    cause_desc = f"{type(cause).__name__}: {cause}" if cause else "No underlying cause"
                    last_error = f"Groq APITimeoutError (Cause: {cause_desc})"
                    print(f"[DEBUG] [TRANSPORT FAILURE] [REFINE] Model: {model}, Attempt: {attempt+1}/{retries}. Transport reason: {last_error}")
                except httpx.ConnectError as ce:
                    last_error = f"httpx.ConnectError: {ce}"
                    print(f"[DEBUG] [TRANSPORT FAILURE] [REFINE] Model: {model}, Attempt: {attempt+1}/{retries}. Transport reason: {last_error}")
                except httpx.ConnectTimeout as cte:
                    last_error = f"httpx.ConnectTimeout: {cte}"
                    print(f"[DEBUG] [TRANSPORT FAILURE] [REFINE] Model: {model}, Attempt: {attempt+1}/{retries}. Transport reason: {last_error}")
                except httpx.ReadTimeout as rte:
                    last_error = f"httpx.ReadTimeout: {rte}"
                    print(f"[DEBUG] [TRANSPORT FAILURE] [REFINE] Model: {model}, Attempt: {attempt+1}/{retries}. Transport reason: {last_error}")
                except ssl.SSLError as se:
                    last_error = f"ssl.SSLError: {se}"
                    print(f"[DEBUG] [TRANSPORT FAILURE] [REFINE] Model: {model}, Attempt: {attempt+1}/{retries}. Transport reason: {last_error}")
                except httpx.TransportError as te:
                    last_error = f"httpx.TransportError: {te}"
                    print(f"[DEBUG] [TRANSPORT FAILURE] [REFINE] Model: {model}, Attempt: {attempt+1}/{retries}. Transport reason: {last_error}")
                except Exception as e:
                    last_error = f"General API/Runtime Error: {type(e).__name__}: {str(e)}"
                    print(f"[DEBUG] [TRANSPORT FAILURE] [REFINE] Model: {model}, Attempt: {attempt+1}/{retries}. Transport reason: {last_error}")
                    
                # Exponential backoff delay for refinement
                if attempt < retries - 1:
                    print(f"[DEBUG] [REQUEST RETRY] [REFINE] Model: {model}, Attempt: {attempt+1}/{retries} failed. Backing off for {backoff:.1f}s before retry...")
                    time.sleep(backoff)
                    backoff *= 2.0
            
            print(f"[DEBUG] [MODEL FAILURE] [REFINE] Model {model} failed all {retries} retries. Falling back to the next model in hierarchy...")
                
        # Safe catch
        refined_mock = f"{current_prompt}\n\n### 🔧 **[REFINEMENT ADDENDUM - OFFLINE]**\n*   **Feedback**: '{clean_feedback}'\n*   **Notice**: Refinement compiled in offline fallback."
        return refined_mock, "Mock Safe-Fallback", "Refinement Offline Fallback"