import json
import time
from pathlib import Path
from typing import List, Dict, Any

# LOCAL PERSISTENT STORAGE FILE
HISTORY_FILE = Path(__file__).resolve().parent / "history.json"
MAX_HISTORY_ITEMS = 25

class HistoryManager:
    """Manages local persistent history of generated prompts with automatic pruning."""

    def __init__(self):
        self.history_file = HISTORY_FILE
        self._ensure_file_exists()

    def _ensure_file_exists(self):
        """Creates the history JSON file if it does not already exist."""
        if not self.history_file.exists():
            try:
                self.history_file.write_text(json.dumps([]), encoding="utf-8")
            except Exception as e:
                print(f"Error creating history file: {e}")

    def load_history(self) -> List[Dict[str, Any]]:
        """Loads prompt logs from JSON, sorted chronologically (latest first)."""
        self._ensure_file_exists()
        try:
            content = self.history_file.read_text(encoding="utf-8")
            history = json.loads(content)
            # Ensure proper structure and sort
            if not isinstance(history, list):
                return []
            return history
        except Exception as e:
            print(f"Error reading prompt history: {e}")
            return []

    def add_history(self, raw_idea: str, category: str, model: str, generated_prompt: str):
        """Appends a new record to history, automatically prunes old items to prevent bloating."""
        self._ensure_file_exists()
        try:
            history = self.load_history()
            
            # Format new history record
            record = {
                "id": str(int(time.time() * 1000)), # Unique miliseconds timestamp ID
                "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
                "raw_idea": raw_idea,
                "category": category,
                "model": model,
                "prompt": generated_prompt
            }
            
            # Add to top of stack
            history.insert(0, record)
            
            # Prune to respect max limit
            if len(history) > MAX_HISTORY_ITEMS:
                history = history[:MAX_HISTORY_ITEMS]
                
            # Write to disk
            self.history_file.write_text(json.dumps(history, indent=4), encoding="utf-8")
            print(f"Prompt logged successfully in history: {raw_idea[:20]}...")
        except Exception as e:
            print(f"Error appending history: {e}")

    def clear_history(self):
        """Completely flushes prompt history."""
        try:
            self.history_file.write_text(json.dumps([]), encoding="utf-8")
            print("Prompt history flushed successfully.")
        except Exception as e:
            print(f"Error flushing history: {e}")

    def get_formatted_list(self) -> List[tuple]:
        """
        Returns history list optimized for Gradio display.
        Returns a list of tuples: (Display Label, Record Prompt Markdown)
        """
        history = self.load_history()
        formatted = []
        for item in history:
            label = f"[{item['category']}] {item['raw_idea'][:30]}..." if len(item['raw_idea']) > 30 else f"[{item['category']}] {item['raw_idea']}"
            formatted.append((label, item['prompt']))
        return formatted
