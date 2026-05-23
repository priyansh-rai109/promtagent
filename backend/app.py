import time
import random
import gradio as gr
import config
from generator import GroqPromptGenerator
from history import HistoryManager

# INITIALIZE CORE BACKEND MODULES
generator = GroqPromptGenerator()
history_db = HistoryManager()

# CLIENT-SIDE JAVASCRIPT COPY UTILITY
COPY_JS_FUNCTION = """
(text) => {
    if (!text || text.trim() === "" || text.startsWith("⚠️")) {
        alert("🛡️ FORGE ERROR: No valid prompt is currently synthesized to copy.");
        return text;
    }
    navigator.clipboard.writeText(text).then(() => {
        alert("🚀 FORGE SUCCESS: Master Prompt copied to neural clipboard!");
    }).catch(err => {
        alert("🛡️ SYSTEM ERROR: Clipboard write blocked by browser security. Copy manually.");
    });
    return text;
}
"""

def get_current_system_time() -> str:
    """Returns formatted system time for the HUD clock."""
    return time.strftime("%Y-%m-%d %H:%M:%S UTC")

def update_random_idea(category: str) -> str:
    """Selects a futuristic raw idea from the configuration database."""
    samples = config.CATEGORIES.get(category, {}).get("samples", ["Build a futuristic system"])
    return random.choice(samples)

def forge_prompt_workflow(raw_idea: str, 
                          category: str, 
                          temperature: float, 
                          max_tokens: float, 
                          selected_model: str) -> tuple:
    """
    Main generator workflow: calls Groq API fallback, persists logs in history,
    and formats returns for the output terminals.
    """
    # Empty protection check
    if not raw_idea.strip():
        return (
            "⚠️ **INPUT ERROR**: Enter a raw idea inside the system command terminal to forge a prompt.",
            "⚠️ **INPUT ERROR**: Enter a raw idea inside the system command terminal to forge a prompt.",
            "None",
            "Input terminal empty.",
            gr.update() # No change to history list
        )
        
    # Trigger generation
    prompt_out, model_used, status_msg = generator.generate_prompt(
        raw_idea=raw_idea,
        category=category,
        temperature=temperature,
        max_tokens=int(max_tokens),
        selected_model=selected_model
    )
    
    # Save successfully generated prompts to persistent history
    if not prompt_out.startswith("⚠️"):
        history_db.add_history(
            raw_idea=raw_idea,
            category=category,
            model=model_used,
            generated_prompt=prompt_out
        )
        
    # Get updated history list formatted for Gradio Dataset
    updated_history = [[label, val] for label, val in history_db.get_formatted_list()]
    
    # Returns: (Markdown Preview, Raw Code Text, Model Used, Status, Updated Dataset UI)
    return prompt_out, prompt_out, model_used, status_msg, updated_history

def refine_prompt_workflow(current_prompt: str, 
                           refine_feedback: str, 
                           category: str, 
                           temperature: float, 
                           max_tokens: float) -> tuple:
    """Handles refinement loop workflow."""
    if not refine_feedback.strip():
        return current_prompt, current_prompt, "None", "No feedback input.", gr.update()
        
    if not current_prompt.strip() or current_prompt.startswith("⚠️"):
        return current_prompt, current_prompt, "None", "No prompt to refine.", gr.update()
        
    prompt_out, model_used, status_msg = generator.refine_prompt(
        current_prompt=current_prompt,
        feedback=refine_feedback,
        category=category,
        temperature=temperature,
        max_tokens=int(max_tokens)
    )
    
    # Log the refined prompt to history as well
    history_db.add_history(
        raw_idea=f"Refinement: {refine_feedback[:20]}...",
        category=category,
        model=model_used,
        generated_prompt=prompt_out
    )
    
    updated_history = [[label, val] for label, val in history_db.get_formatted_list()]
    
    return prompt_out, prompt_out, model_used, status_msg, updated_history

def load_history_item(selected_item: list) -> tuple:
    """Callback when user clicks a history dataset item. Restores the prompt."""
    if not selected_item or len(selected_item) < 2:
        return gr.update(), gr.update()
    # selected_item is [Label, PromptValue]
    prompt_val = selected_item[1]
    return prompt_val, prompt_val

def clear_all_data() -> tuple:
    """Wipes terminals clean."""
    return "", "", "", "Terminal Cleared."

def clear_history_workflow() -> tuple:
    """Completely flushes database logs."""
    history_db.clear_history()
    return [], "History Database Flushed."

# BUILD IMMERSIVE HUD GRADIO INTERFACE
custom_css = config.load_css()

with gr.Blocks(css=custom_css, title="PROMPT_FORGE // Futuristic AI Prompt Synthesizer") as app:
    
    # Dynamic active state storage
    selected_category = gr.State("UI/UX")
    
    # 1. TOP HUD MONITOR HEADER
    with gr.Row(elem_classes=["hud-header"]):
        with gr.Column(scale=3):
            gr.HTML(f"""
                <div class='hud-title'>{config.APP_TITLE}</div>
                <div class='hud-status-indicator'>
                    <div class='status-dot'></div>
                    <span>{config.APP_SUBTITLE}</span>
                </div>
            """)
        with gr.Column(scale=1):
            system_time_str = get_current_system_time()
            api_status = generator.get_system_status()
            gr.HTML(f"""
                <div style='text-align: right; font-family: "Orbitron", monospace; font-size: 0.85rem; color: #94a3b8;'>
                    <div>SYSTEM CLOCK: <span style='color: #00f2fe;'>{system_time_str}</span></div>
                    <div style='margin-top: 4px;'>SYSTEM CODE: <span style='color: #8a2be2;'>{api_status}</span></div>
                </div>
            """)

    # 2. MAIN WORKING SPACE GRID
    with gr.Row():
        
        # LEFT PANEL: CONFIGURATION CONTROL & HISTORY
        with gr.Column(scale=1, min_width=320, elem_classes=["glass-panel"]):
            gr.Markdown("### ⚙️ SYSTEM CORE TUNER")
            
            model_selector = gr.Dropdown(
                choices=config.MODEL_LIST,
                value=config.PRIMARY_MODEL,
                label="Selected LLM Core",
                info="Falls back automatically to next model on API failure.",
                interactive=True
            )
            
            with gr.Accordion("🔧 Advanced Parameters", open=True):
                temp_slider = gr.Slider(
                    minimum=0.0, 
                    maximum=1.2, 
                    value=0.7, 
                    step=0.05, 
                    label="Temperature / Randomness",
                    elem_classes=["hud-slider"]
                )
                tokens_slider = gr.Slider(
                    minimum=256, 
                    maximum=4096, 
                    value=1500, 
                    step=128, 
                    label="Max Tokens Budget",
                    elem_classes=["hud-slider"]
                )
            
            gr.HTML("<hr style='border: 0; border-top: 1px solid rgba(255,255,255,0.05); margin: 20px 0;'>")
            
            gr.Markdown("### 🕒 PROMPT ARCHIVES")
            
            # Clickable history log grid using Dataset
            initial_history = [[label, val] for label, val in history_db.get_formatted_list()]
            history_dataset = gr.Dataset(
                components=[gr.Textbox(visible=False), gr.Textbox(visible=False)],
                samples=initial_history,
                label="Select previously generated prompt to restore:",
                samples_per_page=6,
                elem_id="history-list"
            )
            
            with gr.Row():
                btn_refresh_history = gr.Button("🔄 REFRESH", elem_classes=["cyber-btn-secondary"], size="sm")
                btn_clear_history = gr.Button("🧹 FLUSH", elem_classes=["cyber-btn-secondary"], size="sm")
                
            history_status_bar = gr.Markdown("*System history ready.*", elem_id="history-status")

        # RIGHT PANEL: WORKING TERMINAL & OUTPUT VIEW
        with gr.Column(scale=3):
            
            # CATEGORY CARD INTERACTIVE GRID SELECTOR
            with gr.Column(elem_classes=["glass-panel"]):
                gr.Markdown("### 🗂️ CATEGORY DECK SELECTOR")
                
                with gr.Row():
                    # We render individual category selector buttons with neon styling
                    cat_buttons = {}
                    for name, meta in config.CATEGORIES.items():
                        # Standard label: icon + title
                        label = f"{meta['icon']} {name}"
                        # Set default styling classes
                        btn_class = "category-card selected" if name == "UI/UX" else "category-card"
                        cat_buttons[name] = gr.Button(
                            value=label, 
                            variant="secondary",
                            elem_classes=[btn_class]
                        )
                
                # Active Category display status
                active_category_viewer = gr.Markdown("**Selected Deck**: `🎨 UI/UX` — *Premium User Interfaces & Immersive Web Layouts*", elem_id="category-meta-view")

            # CENTRAL INPUT COCKPIT
            with gr.Column(elem_classes=["glass-panel", "panel-margin"]):
                gr.Markdown("### 🖥️ RAW IDEA COMMAND TERMINAL")
                
                input_textarea = gr.Textbox(
                    placeholder="Enter a brief, raw concept idea... (e.g. 'A futuristic glassmorphic server status dashboard with active nodes')",
                    lines=4,
                    label="Synthesizer Input Command",
                    elem_classes=["cyber-input"]
                )
                
                with gr.Row():
                    btn_random = gr.Button("🎲 SUGGEST CONCEPT", elem_classes=["cyber-btn-secondary"])
                    btn_clear = gr.Button("🧹 WIPE INPUT", elem_classes=["cyber-btn-secondary"])
                    btn_generate = gr.Button("🚀 FORGE MASTER PROMPT", elem_classes=["cyber-btn"])
            
            # STUNNING DUAL-PANE OUTPUT SYSTEM
            with gr.Column(elem_classes=["glass-panel", "panel-margin"]):
                gr.Markdown("### 💎 SYNTHESIZED MASTER PROMPT TERMINAL")
                
                # Dynamic model & metrics HUD display
                with gr.Row():
                    active_model_badge = gr.Markdown("🟢 **Active Core**: `Offline Fallback`")
                    generation_metrics_badge = gr.Markdown("⏱️ **Metrics**: `Pending Core Trigger`")
                
                # Dual output panes
                with gr.Tabs(selected=0) as output_tabs:
                    with gr.Tab("🎬 CINEMATIC PREVIEW", id=0):
                        markdown_renderer = gr.Markdown(
                            value="*Synthesized master prompts will render dynamically here with elegant markdown styling.*", 
                            elem_id="markdown-preview"
                        )
                    with gr.Tab("📝 RAW PROMPT CODE", id=1):
                        raw_code_textbox = gr.Textbox(
                            placeholder="Raw code will appear here...",
                            lines=12,
                            label="Synthesized Copyable Text Block",
                            elem_classes=["cyber-output"]
                        )
                
                with gr.Row():
                    btn_copy = gr.Button("📋 COPY MASTER PROMPT TO CLIPBOARD", elem_classes=["cyber-btn"])
                    
                # REFINEMENT HUD
                gr.HTML("<hr style='border: 0; border-top: 1px solid rgba(255,255,255,0.05); margin: 20px 0;'>")
                gr.Markdown("### 🔧 DYNAMIC REFINEMENT HUD")
                with gr.Row():
                    refine_input = gr.Textbox(
                        placeholder="Add adjustment guidelines... (e.g. 'make it strictly clean code without comments', 'focus on contrast')",
                        label="Enter Refinement Feedback Instructions",
                        scale=4,
                        elem_classes=["cyber-input"]
                    )
                    btn_refine = gr.Button("🔧 REFINE PROMPT", elem_classes=["cyber-btn"], scale=1)

    # 3. HUD FOOTER
    gr.HTML(f"""
        <div class='hud-footer'>
            <p>PROMPT_FORGE v2.5 // CORE DEPLOYED // ANTI-GRAVITY ENGINEERING INC. 🚀</p>
            <p style='font-size: 0.75rem; color: #64748b; margin-top: 5px;'>Powered by Groq High-Velocity Inference Engines & Llama 3 Architectures</p>
        </div>
    """)

    # --- CONTROLLER ACTIONS & INTERFACES ---
    
    # Dynamic category button select logic
    def create_category_select_handler(category_name):
        def handler():
            desc = config.CATEGORIES[category_name]['description']
            icon = config.CATEGORIES[category_name]['icon']
            
            # Select a fresh random sample idea for this category
            fresh_idea = random.choice(config.CATEGORIES[category_name]['samples'])
            
            # Prepare updates for category buttons to show selection highlight
            btn_updates = []
            for name in config.CATEGORIES.keys():
                if name == category_name:
                    btn_updates.append(gr.update(elem_classes=["category-card selected"]))
                else:
                    btn_updates.append(gr.update(elem_classes=["category-card"]))
                    
            meta_label = f"**Selected Deck**: `{icon} {category_name}` — *{desc}*"
            
            # Outputs: selected_category state, category description string, input text area value, and button styling updates
            return [category_name, meta_label, fresh_idea] + btn_updates
            
        return handler

    # Bind handlers to all category buttons dynamically
    cat_button_list = [cat_buttons[name] for name in config.CATEGORIES.keys()]
    for name, button in cat_buttons.items():
        button.click(
            fn=create_category_select_handler(name),
            inputs=[],
            outputs=[selected_category, active_category_viewer, input_textarea] + cat_button_list
        )

    # Suggest Random Concept Trigger
    btn_random.click(
        fn=update_random_idea,
        inputs=[selected_category],
        outputs=[input_textarea]
    )

    # Clean & Wipe Terminal Trigger
    btn_clear.click(
        fn=clear_all_data,
        inputs=[],
        outputs=[input_textarea, raw_code_textbox, markdown_renderer, generation_metrics_badge]
    )

    # Main Generation Process Trigger
    btn_generate.click(
        fn=forge_prompt_workflow,
        inputs=[
            input_textarea, 
            selected_category, 
            temp_slider, 
            tokens_slider, 
            model_selector
        ],
        outputs=[
            markdown_renderer, 
            raw_code_textbox, 
            active_model_badge, 
            generation_metrics_badge,
            history_dataset
        ]
    )

    # Refine Prompt Workflow Trigger
    btn_refine.click(
        fn=refine_prompt_workflow,
        inputs=[
            raw_code_textbox, 
            refine_input, 
            selected_category, 
            temp_slider, 
            tokens_slider
        ],
        outputs=[
            markdown_renderer, 
            raw_code_textbox, 
            active_model_badge, 
            generation_metrics_badge,
            history_dataset
        ]
    )

    # Interactive Client-Side Browser Prompt Clipboard copying (Instant JS)
    btn_copy.click(
        fn=None,
        inputs=[raw_code_textbox],
        outputs=[],
        js=COPY_JS_FUNCTION
    )

    # Clickable History Item Loader callback
    def on_history_click(evt: gr.SelectData):
        # evt.value is the clicked label, but we want the actual prompt mapping.
        # Let's retrieve from database directly based on selection index or matching.
        history_list = history_db.load_history()
        idx = evt.index
        if 0 <= idx < len(history_list):
            prompt = history_list[idx]['prompt']
            model = history_list[idx]['model']
            category = history_list[idx]['category']
            idea = history_list[idx]['raw_idea']
            
            status = f"Restored item #{idx+1} successfully from history."
            model_badge = f"🟢 **Active Core**: `{model}`"
            
            # Restores: Markdown view, Code view, active category state, input text area, active model badge, status
            return prompt, prompt, category, idea, model_badge, status
        return gr.update(), gr.update(), gr.update(), gr.update(), gr.update(), "Error loading item."

    history_dataset.select(
        fn=on_history_click,
        inputs=[],
        outputs=[
            markdown_renderer, 
            raw_code_textbox, 
            selected_category, 
            input_textarea,
            active_model_badge,
            generation_metrics_badge
        ]
    )

    # Refresh history button trigger
    def refresh_history_list():
        updated_history = [[label, val] for label, val in history_db.get_formatted_list()]
        return updated_history, "History refreshed successfully."

    btn_refresh_history.click(
        fn=refresh_history_list,
        inputs=[],
        outputs=[history_dataset, history_status_bar]
    )

    # Flush/Clear history button trigger
    btn_clear_history.click(
        fn=clear_history_workflow,
        inputs=[],
        outputs=[history_dataset, history_status_bar]
    )

# MOUNT & LAUNCH PIPELINE
if __name__ == "__main__":
    app.queue().launch(
        server_name="0.0.0.0",
        server_port=7860
    )
