# AI Resume Analyzer

A full-stack AI-powered resume analysis tool. Upload a resume (PDF or DOCX) and paste a job description to receive a comprehensive evaluation including match scoring, skill gap analysis, impact assessment, soft skills review, and tailored interview preparation.

**Powered by Google Gemini 2.5 Flash.**

---

## Architecture

```
resume-analyzer/
├── backend/      # FastAPI + Python (Gemini integration)
└── frontend/     # React + Vite + TypeScript + Tailwind CSS
```

Both are independent projects — no shared package manager.

---

## Prerequisites

- **Python 3.11+** with `pip`
- **Node.js 18+** with `npm`
- **Gemini API Key** — get one at [Google AI Studio](https://aistudio.google.com/apikey)

---

## Backend Setup

```bash
cd backend

# Create and activate a virtual environment
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
copy .env.example .env
# Edit .env and add your Gemini API key:
# GEMINI_API_KEY=your_key_here

# Run the server
uvicorn main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`.

### API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/health` | Health check |
| `POST` | `/api/analyze` | Analyze resume against job description |

---

## Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
copy .env.example .env
# The default VITE_API_BASE_URL=http://localhost:8000 should work for local dev

# Run the dev server
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Default |
|----------|-------------|---------|
| `GEMINI_API_KEY` | Your Google Gemini API key | *(required)* |
| `ALLOWED_ORIGINS` | Comma-separated CORS origins | `http://localhost:5173` |

### Frontend (`frontend/.env`)

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API URL | `http://localhost:8000` |

---

## Running Both Servers

Open two terminals:

**Terminal 1 — Backend:**
```bash
cd backend
venv\Scripts\activate
uvicorn main:app --reload --port 8000
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```

Then open `http://localhost:5173` in your browser.

---

## Features

- **Match Score** — 0-100 score with color-coded gauge
- **Keyword Analysis** — matched vs. missing skills/technologies
- **Strengths & Gaps** — detailed assessment with evidence
- **Impact Assessment** — quantified impact scoring with bullet point rewrites
- **Soft Skills Analysis** — leadership and communication evaluation
- **Interview Prep** — 3-5 tailored questions with model answers
- **ATS Compatibility** — formatting issue detection
- **Actionable Suggestions** — specific improvement recommendations

---

## Security Notes

- API keys are never committed — only `.env.example` files are tracked
- All file uploads are processed in-memory (never written to disk)
- Server-side validation enforces file type, size, and content checks
- Gemini errors are caught and returned as clean error messages (no SDK errors leaked)
