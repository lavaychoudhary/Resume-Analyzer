# AI Resume Analyzer

A full-stack AI-powered resume analysis tool. Upload a resume (PDF or DOCX) and paste a job description to receive a comprehensive evaluation including match scoring, skill gap analysis, impact assessment, soft skills review, and tailored interview preparation.

**Powered by Groq (GPT-OSS 120B).**

---

## Architecture

```
resume-analyzer/
├── api/                    # FastAPI backend (Python)
│   ├── index.py            # App entry point, validation, endpoints
│   ├── extractors/         # PDF / DOCX text extraction
│   ├── schemas/            # Pydantic response models
│   ├── services/
│   │   └── groq_service.py # Groq integration
│   └── requirements.txt
├── src/                    # React + Vite + TypeScript + Tailwind frontend
├── .env                    # Environment variables (not committed)
└── package.json
```

The frontend and backend live in the same project folder and run as two separate processes.

---

## Prerequisites

- **Python 3.11+** with `pip`
- **Node.js 18+** with `npm`
- **Groq API Key** — create one at [Groq Console](https://console.groq.com/keys) (starts with `gsk_`)

---

## Setup

All commands are run from the `resume-analyzer` folder.

### 1. Backend

```powershell
# Create and activate a virtual environment
python -m venv venv
venv\Scripts\activate

# Install dependencies
pip install -r api\requirements.txt
```

### 2. Environment variables

Create a `.env` file in the `resume-analyzer` folder:

```
VITE_API_BASE_URL=http://localhost:8000
GROQ_API_KEY=gsk_your_key_here
```

### 3. Frontend

```powershell
npm install
```

---

## Running the App

Open two terminals in the `resume-analyzer` folder.

**Terminal 1 — Backend:**
```powershell
npm run backend
```
(equivalent to `venv\Scripts\python.exe -m uvicorn api.index:app --reload --port 8000`)

**Terminal 2 — Frontend:**
```powershell
npm run dev
```

Then open `http://localhost:5173` in your browser.

In VS Code you can also run the **"Run AI Resume Analyzer (Both)"** task to start both servers at once.

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/health` | Health check |
| `POST` | `/api` | Analyze a resume against a job description |

`POST /api` accepts `multipart/form-data` with:

- `resume` — PDF or DOCX file (max 5 MB)
- `job_description` — job description text

---

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `GROQ_API_KEY` | Your Groq API key | *(required)* |
| `GROQ_MODEL` | Override the model used for analysis | `openai/gpt-oss-120b`, falling back to `qwen/qwen3.6-27b` then `openai/gpt-oss-20b` |
| `ALLOWED_ORIGINS` | Comma-separated CORS origins | `http://localhost:5173` |
| `VITE_API_BASE_URL` | Backend URL used by the frontend | `http://localhost:8000` |

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
- **Resume Verification** — rejects non-resume documents

---

## Troubleshooting

| Error | Fix |
|-------|-----|
| `ModuleNotFoundError: No module named 'groq'` | Install into the venv: `venv\Scripts\python.exe -m pip install groq` |
| `Invalid GROQ_API_KEY` | Check `.env` — the key should start with `gsk_`, with no quotes or spaces. Restart the backend after editing. |
| `Groq rate limit exceeded` | Wait a moment and retry, or check your usage limits in the Groq Console. |
| "Cannot connect to the backend server" | Make sure the backend is running on port 8000. |

---

## Security Notes

- API keys are never committed — `.env` is in `.gitignore`
- All file uploads are processed in-memory (never written to disk)
- Server-side validation enforces file type, size, and content checks
- Groq errors are caught and returned as clean error messages (no SDK errors leaked)
