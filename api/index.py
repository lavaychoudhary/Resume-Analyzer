"""
AI Resume Analyzer — FastAPI Backend

Provides endpoints for resume analysis using Groq AI.
"""

from __future__ import annotations

import os
import re

from dotenv import load_dotenv
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from extractors.text_extractor import ExtractionError, extract_text
from schemas.models import AnalysisResult
from services.groq_service import GroqServiceError, analyze_resume

# ── Load environment ───────────────────────────────────────────────────────
load_dotenv(override=True)

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


@app.post("/api", response_model=AnalysisResult)
async def analyze(
    resume: UploadFile = File(..., description="Resume file (PDF or DOCX)"),
    job_description: str = Form(..., description="Job description text"),
):
    """
    Analyze a resume against a job description using Groq AI.

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

    # ── Strict verification: Is the uploaded file a resume? ─────────────
    lower_text = resume_text.lower()

    # Category 1: Obvious non-resume documents (recipes, invoices, terms, stories)
    non_resume_markers = [
        "ingredients:", "tablespoon", "teaspoon", "preheat oven", "bake for", "servings:",
        "invoice number", "amount due:", "bill to:", "subtotal:", "tax invoice", "total due:",
        "terms and conditions", "privacy policy", "chapter 1", "once upon a time",
        "abstract\n", "in this paper we", "table of contents",
    ]
    if any(marker in lower_text for marker in non_resume_markers):
        raise HTTPException(
            status_code=422,
            detail="This is not a resume! Please upload a valid resume or CV.",
        )

    # Category 2: Multi-pillar structural check
    # Genuine resumes exhibit contact info, work history, education credentials, and skill lists.
    has_contact = bool(re.search(r"[\w\.-]+@[\w\.-]+\.\w+", resume_text)) or bool(re.search(r"\+?\d[\d\s\-\(\)]{8,}\d", resume_text)) or "linkedin" in lower_text or "github" in lower_text
    has_work = any(w in lower_text for w in [
        "experience", "work history", "employment", "professional experience",
        "internship", "job history", "responsibilities", "work summary"
    ])
    has_edu = any(w in lower_text for w in [
        "education", "bachelor", "master", "university", "college", "degree",
        "b.tech", "b.e", "bsc", "msc", "mba", "phd", "academic background"
    ])
    has_skills = any(w in lower_text for w in [
        "skills", "technical skills", "technologies", "competencies", "tools & technologies", "proficiencies", "programming"
    ])
    has_cv_terms = any(w in lower_text for w in [
        "curriculum vitae", "resume", "summary of qualifications", "projects", "certifications"
    ])

    pillar_count = sum([has_contact, has_work, has_edu, has_skills, has_cv_terms])

    # A document with fewer than 2 resume pillars is not a resume
    if pillar_count < 2 and not (has_work and has_skills):
        raise HTTPException(
            status_code=422,
            detail="This is not a resume! Please upload a valid resume or CV.",
        )

    # ── Call Groq for analysis ───────────────────────────────────────
    try:
        result = await analyze_resume(resume_text, job_description)
    except GroqServiceError as exc:
        raise HTTPException(
            status_code=502,
            detail=str(exc),
        )

    # ── AI verification check ──────────────────────────────────────────
    if not result.is_resume:
        raise HTTPException(
            status_code=422,
            detail="This is not a resume! Please upload a valid resume or CV.",
        )

    return result


# ── Global exception handler for unexpected errors ─────────────────────────


import traceback

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Catch-all handler to prevent leaking internal errors to the client."""
    print("Unhandled exception in API:")
    traceback.print_exc()
    return JSONResponse(
        status_code=500,
        content={"detail": "An unexpected error occurred. Please try again later."},
    )
