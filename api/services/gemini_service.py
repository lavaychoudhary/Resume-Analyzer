"""
Gemini integration service for resume analysis.

Uses the google-genai SDK with structured JSON output to produce
a validated AnalysisResult in a single API call.
"""

from __future__ import annotations

import json
import os
from typing import Any

from google import genai
from google.genai import types

from schemas.models import AnalysisResult


# ── Gemini response schema ────────────────────────────────────────────────
# Mirrors the Pydantic models so the LLM is structurally constrained.

_RESPONSE_SCHEMA: dict[str, Any] = {
    "type": "OBJECT",
    "properties": {
        "is_resume": {
            "type": "BOOLEAN",
            "description": "True if the document is a genuine resume, CV, or professional profile. False if not a resume (e.g. cooking recipe, invoice, essay, news article, code, random text, assignment, etc.).",
        },
        "rejection_reason": {
            "type": "STRING",
            "description": "If is_resume is false, set to 'This is not a resume!'. If true, set to empty string.",
        },
        "match_score": {
            "type": "INTEGER",
            "description": "Overall match score 0-100",
        },
        "summary": {
            "type": "STRING",
            "description": "2-3 sentence overall assessment",
        },
        "matched_keywords": {
            "type": "ARRAY",
            "items": {"type": "STRING"},
            "description": "Keywords/skills from the JD found in the resume",
        },
        "missing_keywords": {
            "type": "ARRAY",
            "items": {"type": "STRING"},
            "description": "Keywords/skills from the JD NOT found in the resume",
        },
        "strengths": {
            "type": "ARRAY",
            "items": {
                "type": "OBJECT",
                "properties": {
                    "point": {"type": "STRING", "description": "Short headline"},
                    "detail": {
                        "type": "STRING",
                        "description": "One-sentence elaboration with evidence",
                    },
                },
                "required": ["point", "detail"],
            },
        },
        "gaps": {
            "type": "ARRAY",
            "items": {
                "type": "OBJECT",
                "properties": {
                    "point": {"type": "STRING", "description": "Short headline"},
                    "detail": {
                        "type": "STRING",
                        "description": "One-sentence elaboration with evidence",
                    },
                },
                "required": ["point", "detail"],
            },
        },
        "suggestions": {
            "type": "ARRAY",
            "items": {"type": "STRING"},
            "description": "Actionable suggestions to improve the resume",
        },
        "ats_notes": {
            "type": "STRING",
            "description": "ATS formatting issues or 'None detected'",
        },
        "impact_assessment": {
            "type": "OBJECT",
            "properties": {
                "impact_score": {
                    "type": "INTEGER",
                    "description": "0-100 score for quantified outcomes",
                },
                "summary": {
                    "type": "STRING",
                    "description": "1-2 sentence impact quality summary",
                },
                "weak_bullets": {
                    "type": "ARRAY",
                    "items": {
                        "type": "OBJECT",
                        "properties": {
                            "original": {
                                "type": "STRING",
                                "description": "Verbatim weak bullet from resume",
                            },
                            "rewrite_suggestion": {
                                "type": "STRING",
                                "description": "Results-oriented rewrite",
                            },
                        },
                        "required": ["original", "rewrite_suggestion"],
                    },
                },
            },
            "required": ["impact_score", "summary", "weak_bullets"],
        },
        "soft_skills_assessment": {
            "type": "OBJECT",
            "properties": {
                "summary": {
                    "type": "STRING",
                    "description": "1-2 sentence overall soft skills read",
                },
                "demonstrated": {
                    "type": "ARRAY",
                    "items": {
                        "type": "OBJECT",
                        "properties": {
                            "trait": {"type": "STRING"},
                            "evidence": {
                                "type": "STRING",
                                "description": "Line from resume showing this trait",
                            },
                        },
                        "required": ["trait", "evidence"],
                    },
                },
                "underrepresented": {
                    "type": "ARRAY",
                    "items": {"type": "STRING"},
                    "description": "Traits absent or under-evidenced",
                },
            },
            "required": ["summary", "demonstrated", "underrepresented"],
        },
        "interview_prep_questions": {
            "type": "ARRAY",
            "minItems": "3",
            "maxItems": "5",
            "items": {
                "type": "OBJECT",
                "properties": {
                    "question": {"type": "STRING"},
                    "rationale": {
                        "type": "STRING",
                        "description": "Why this question is being asked",
                    },
                    "model_answer": {
                        "type": "STRING",
                        "description": "First-person draft answer grounded in resume content",
                    },
                },
                "required": ["question", "rationale", "model_answer"],
            },
        },
    },
    "required": [
        "is_resume",
        "match_score",
        "summary",
        "matched_keywords",
        "missing_keywords",
        "strengths",
        "gaps",
        "suggestions",
        "ats_notes",
        "impact_assessment",
        "soft_skills_assessment",
        "interview_prep_questions",
    ],
}

# ── System instruction ─────────────────────────────────────────────────────

_SYSTEM_INSTRUCTION = """You are an expert technical recruiter and hiring manager with deep experience evaluating resumes against job descriptions.

CRITICAL FIRST RULE — RESUME VERIFICATION:
First, inspect the uploaded RESUME text. Determine whether it is a genuine personal resume, CV, or professional work profile of an individual.
- If the uploaded document is clearly NOT a resume (for example: a cooking recipe, food menu, invoice, billing receipt, essay, novel, news article, code script, legal agreement, random text, or non-resume document):
  You MUST set is_resume to false and rejection_reason to "This is not a resume!".
  For the other fields, fill minimal fallback values (match_score: 0, summary: "This is not a resume!").
- If the document IS a genuine resume, CV, or professional profile:
  Set is_resume to true, rejection_reason to "", and proceed with full evaluation according to the rules below.

EVALUATION RULES:
- Be honest and specific — do NOT inflate scores.
- Base every claim strictly on the resume text and job description provided; do NOT invent skills, metrics, or experience the candidate did not state.
- match_score must be an integer 0-100 reflecting how well the resume fits the job description.
- impact_score must be an integer 0-100 rating how well the resume quantifies outcomes (%, $, time saved, team size, scale) vs plain responsibility statements.
- For skill gaps, list ONLY technologies, tools, certifications, or qualifications stated or clearly implied by the job description that do NOT appear anywhere in the resume. Do not pad with nice-to-haves the JD didn't ask for.
- For impact assessment, pull out specific weak bullet points VERBATIM from the resume and provide a results-oriented rewrite for each.
- For soft skills, ground every claim in something actually written in the resume. Return what's demonstrated well (with the evidence line) and what's absent or under-evidenced.
- For interview prep questions, act as the hiring manager for THIS specific role. Generate 3-5 tailored questions with rationale and model_answer.
- For ats_notes, flag any formatting issues (tables, images, unusual fonts, missing standard section headers) that could trip up an ATS. If none, return "None detected".
"""


class GeminiServiceError(Exception):
    """Raised when the Gemini API call fails."""

    pass


async def analyze_resume(resume_text: str, job_description: str) -> AnalysisResult:
    """
    Send resume text and job description to Gemini for analysis.

    Returns a validated AnalysisResult model.

    Raises
    ------
    GeminiServiceError
        If the API call fails, times out, or returns malformed data.
    """
    from dotenv import load_dotenv
    load_dotenv(override=True)

    api_key = os.getenv("GEMINI_API_KEY", "").strip()
    if not api_key:
        raise GeminiServiceError("GEMINI_API_KEY is not configured in .env")

    user_content = (
        f"--- RESUME ---\n{resume_text}\n\n"
        f"--- JOB DESCRIPTION ---\n{job_description}"
    )

    client = genai.Client(api_key=api_key)

    # Discover available models from Google AI Studio dynamically
    candidate_models: list[str] = []
    try:
        live_models = []
        for m in client.models.list():
            m_name = (m.name or "").removeprefix("models/")
            live_models.append(m_name)
        
        # Sort by preference for active models
        preferred_order = [
            "gemini-2.5-flash",
            "gemini-3.5-flash",
            "gemini-2.0-flash",
            "gemini-2.5-pro",
            "gemini-1.5-flash",
        ]
        for pref in preferred_order:
            for lm in live_models:
                if pref == lm and lm not in candidate_models:
                    candidate_models.append(lm)
        
        # Add any remaining flash/pro models from the live list
        for lm in live_models:
            if ("flash" in lm or "pro" in lm) and "embed" not in lm and "vision" not in lm and lm not in candidate_models:
                candidate_models.append(lm)
    except Exception as list_err:
        print(f"[GEMINI LIST MODELS WARNING]: {list_err}")

    # Fallbacks if list API was restricted or empty
    if not candidate_models:
        candidate_models = ["gemini-2.5-flash", "gemini-3.5-flash", "gemini-2.0-flash", "gemini-1.5-flash"]

    print(f"[USING CANDIDATE MODELS]: {candidate_models}")
    last_error: Exception | None = None

    for model_name in candidate_models:
        try:
            response = client.models.generate_content(
                model=model_name,
                contents=user_content,
                config=types.GenerateContentConfig(
                    system_instruction=_SYSTEM_INSTRUCTION,
                    temperature=0.2,
                    response_mime_type="application/json",
                    response_schema=_RESPONSE_SCHEMA,
                ),
            )

            raw_text = response.text
            if not raw_text:
                raise GeminiServiceError("Gemini returned an empty response")

            data = json.loads(raw_text)
            result = AnalysisResult.model_validate(data)
            return result

        except GeminiServiceError:
            raise
        except json.JSONDecodeError as exc:
            print(f"[GEMINI ERROR with {model_name}] Invalid JSON: {exc}")
            last_error = exc
            continue
        except Exception as exc:
            print(f"[GEMINI ERROR with {model_name}] {type(exc).__name__}: {exc}")
            last_error = exc
            continue

    error_detail = str(last_error) if last_error else "All candidate models failed"
    if "API_KEY_INVALID" in error_detail or "API key not valid" in error_detail:
        raise GeminiServiceError("Invalid GEMINI_API_KEY. Please verify your Gemini API key in .env.")
    if "RESOURCE_EXHAUSTED" in error_detail or "quota" in error_detail.lower():
        raise GeminiServiceError("Gemini API rate limit or quota exceeded. Please wait a moment or check your Google AI Studio quota.")

    raise GeminiServiceError(f"{type(last_error).__name__}: {last_error}") from last_error
