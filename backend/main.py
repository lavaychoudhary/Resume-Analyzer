"""
AI Resume Analyzer — FastAPI Backend

Provides endpoints for resume analysis using Gemini AI.
"""

from __future__ import annotations

import os

from dotenv import load_dotenv
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from extractors.text_extractor import ExtractionError, extract_text
from schemas.models import AnalysisResult
from services.gemini_service import GeminiServiceError, analyze_resume

# ── Load environment ───────────────────────────────────────────────────────
load_dotenv()

# ── App setup ──────────────────────────────────────────────────────────────
app = FastAPI(
    title="AI Resume Analyzer",
    description="Upload a resume and job description to receive AI-powered analysis",
    version="1.0.0",
)

# ── CORS ───────────────────────────────────────────────────────────────────
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in allowed_origins],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
    allow_credentials=True,
)

# ── Constants ──────────────────────────────────────────────────────────────
ALLOWED_EXTENSIONS = {"pdf", "docx"}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB
MIN_TEXT_LENGTH = 50


# ── Endpoints ──────────────────────────────────────────────────────────────


@app.get("/api/health")
async def health_check():
    """Health check endpoint for uptime monitoring."""
    return {"status": "ok"}


@app.post("/api/analyze", response_model=AnalysisResult)
async def analyze(
    resume: UploadFile = File(..., description="Resume file (PDF or DOCX)"),
    job_description: str = Form(..., description="Job description text"),
):
    """
    Analyze a resume against a job description using Gemini AI.

    Accepts multipart/form-data with a resume file and job description text.
    Returns a structured analysis including match score, strengths, gaps,
    impact assessment, soft skills analysis, and interview prep questions.
    """

    # ── Validate file extension ────────────────────────────────────────
    filename = resume.filename or ""
    extension = filename.rsplit(".", maxsplit=1)[-1].lower() if "." in filename else ""
    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type: .{extension}. Only .pdf and .docx files are accepted.",
        )

    # ── Validate file size ─────────────────────────────────────────────
    file_bytes = await resume.read()
    if len(file_bytes) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=413,
            detail=f"File too large ({len(file_bytes) / (1024 * 1024):.1f} MB). Maximum allowed size is 5 MB.",
        )

    # ── Validate job description ───────────────────────────────────────
    if not job_description.strip():
        raise HTTPException(
            status_code=400,
            detail="Job description cannot be empty.",
        )

    # ── Extract text ───────────────────────────────────────────────────
    try:
        resume_text = extract_text(file_bytes, filename)
    except ExtractionError as exc:
        raise HTTPException(status_code=422, detail=str(exc))

    # ── Validate extracted text length ─────────────────────────────────
    if len(resume_text.strip()) < MIN_TEXT_LENGTH:
        raise HTTPException(
            status_code=422,
            detail=(
                "The uploaded file appears to have no extractable text "
                "(it may be a scanned/image-only document). "
                "Please upload a text-based PDF or DOCX file."
            ),
        )

    # ── Call Gemini for analysis ───────────────────────────────────────
    try:
        result = await analyze_resume(resume_text, job_description)
    except GeminiServiceError:
        raise HTTPException(
            status_code=502,
            detail="Analysis service is currently unavailable. Please try again later.",
        )

    return result


# ── Global exception handler for unexpected errors ─────────────────────────


@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Catch-all handler to prevent leaking internal errors to the client."""
    return JSONResponse(
        status_code=500,
        content={"detail": "An unexpected error occurred. Please try again later."},
    )
