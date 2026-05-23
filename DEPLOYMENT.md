# 📦 MONOREPO PRODUCTION DEPLOYMENT MANUAL

Since `PromptCraft AI` is structured as a unified monorepo, deploying the app is exceptionally simple. The Python FastAPI backend serves the compiled static React files directly and mounts legacy Gradio, allowing a robust, one-port web service deployment on all cloud servers.

---

## 🏗️ Step 0: Ensure Frontend is Compiled
Before pushing or deploying to any platform, make sure to compile the React build so that static files exist in `frontend/dist/`:
```bash
cd frontend
npm install
npm run build
cd ..
```
*Vite will compile the code to `frontend/dist` which is committed or bundled for the backend to serve.*

---

## 🚀 1. Deploying to Hugging Face Spaces
Hugging Face natively hosts Gradio apps, but since we are serving a unified React + FastAPI app, we can host it as a **Docker Space** or standard python space!

### Step-by-Step:
1.  Log in to [Hugging Face](https://huggingface.co/) and click **New Space**.
2.  Select **Docker** as the Space SDK (this is the most reliable way to run a custom FastAPI monorepo).
3.  Choose the **Blank** template.
4.  Write a simple `Dockerfile` in the root:
    ```dockerfile
    FROM python:3.11-slim
    WORKDIR /app
    COPY . .
    RUN pip install -r requirements.txt
    EXPOSE 7860
    CMD ["python", "backend/main.py"]
    ```
5.  Set your Space visibility to **Public** or **Private**.
6.  Navigate to the Space **Settings** and add your **Secret**:
    *   `GROQ_API_KEY` = *[Your Groq API Key]*
7.  HF will build the Docker container and start your premium cyberpunk interface automatically!

---

## 🚂 2. Deploying to Railway
Railway is perfect for running lightweight Dockerized or buildpack-based web apps.

### Step-by-Step:
1.  Initialize git, commit all files (including `frontend/dist/`):
    ```bash
    git init
    git add .
    git commit -m "feat: init PromptCraft AI cyberpunk release"
    ```
2.  Log in to [Railway](https://railway.app/) and connect your GitHub repository.
3.  Click **Add Variables** and configure:
    *   `GROQ_API_KEY` = *[Your Groq API Key]*
    *   `PORT` = `8000`
4.  Under **Service Settings**, set the **Start Command**:
    ```bash
    python backend/main.py
    ```
5.  Railway will build the buildpack and provision a public domain URL automatically.

---

## ❄️ 3. Deploying to Render (Blueprint & One-Click)
Render provides free web services for Python apps. We have included a pre-configured `render.yaml` blueprint file in the root to make deployment automatic.

### Method A: One-Click Blueprint (Recommended)
1. Push your code to your GitHub repository.
2. Go to **Blueprints** in your Render Dashboard.
3. Click **New Blueprint Instance** and connect your repository.
4. Render will automatically parse the `render.yaml` configuration, install dependencies, compile the React frontend, set the correct port, and prompt you to input your `GROQ_API_KEY` before launching!

### Method B: Manual Web Service
1. Connect your GitHub repository to [Render](https://render.com/).
2. Click **New +** ➔ **Web Service**.
3. Configure the parameters:
    *   **Runtime**: `Python`
    *   **Build Command**: `pip install -r requirements.txt && cd frontend && npm install && npm run build && cd ..`
    *   **Start Command**: `python backend/main.py`
    *   **Plan**: `Free`
4. Add the Environment Variable:
    *   `GROQ_API_KEY` = *[Your Groq API Key]*
5. Render will spin up the server and give you a public web URL.

---

## ⚡ 4. Deploying to Replit
Replit is ideal for immediate online editing and hosting.

### Step-by-Step:
1.  Import your repository into Replit.
2.  Open the **Secrets Tool** (padlock icon in the sidebar) and add:
    *   Key: `GROQ_API_KEY`
    *   Value: *[Your Groq API Key]*
3.  Set the **Start Command** in the Replit run console:
    ```bash
    python backend/main.py
    ```
4.  Click the green **Run** button to launch the app!
