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

RULES:
- Be honest and specific — do NOT inflate scores.
- Base every claim strictly on the resume text and job description provided; do NOT invent skills, metrics, or experience the candidate did not state.
- match_score must be an integer 0-100 reflecting how well the resume fits the job description.
- impact_score must be an integer 0-100 rating how well the resume quantifies outcomes (%, $, time saved, team size, scale) vs plain responsibility statements.
- For skill gaps, list ONLY technologies, tools, certifications, or qualifications stated or clearly implied by the job description that do NOT appear anywhere in the resume. Do not pad with nice-to-haves the JD didn't ask for.
- For impact assessment, pull out specific weak bullet points VERBATIM from the resume and provide a results-oriented rewrite for each.
- For soft skills, ground every claim in something actually written in the resume. Return what's demonstrated well (with the evidence line) and what's absent or under-evidenced.
- For interview prep questions, act as the hiring manager for THIS specific role. Generate 3-5 tailored questions. At least some should probe the missing-skills gap or ask the candidate to substantiate their strongest/vaguest claims. Each question MUST include a rationale and a model_answer — a first-person draft answer grounded in the candidate's actual resume content, not a generic template.
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
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise GeminiServiceError("GEMINI_API_KEY is not configured")

    user_content = (
        f"--- RESUME ---\n{resume_text}\n\n"
        f"--- JOB DESCRIPTION ---\n{job_description}"
    )

    try:
        client = genai.Client(api_key=api_key)

        response = client.models.generate_content(
            model="gemini-3.5-flash",
            contents=user_content,
            config=types.GenerateContentConfig(
                system_instruction=_SYSTEM_INSTRUCTION,
                temperature=0.2,
                response_mime_type="application/json",
                response_schema=_RESPONSE_SCHEMA,
            ),
        )

        # Parse the JSON text from the response
        raw_text = response.text
        if not raw_text:
            raise GeminiServiceError("Gemini returned an empty response")

        data = json.loads(raw_text)

        # Validate through Pydantic (this also computes score_label)
        result = AnalysisResult.model_validate(data)
        return result

    except GeminiServiceError:
        raise
    except json.JSONDecodeError as exc:
        print(f"[GEMINI ERROR] Invalid JSON: {exc}")
        raise GeminiServiceError(f"Gemini returned invalid JSON: {exc}") from exc
    except Exception as exc:
        print(f"[GEMINI ERROR] {type(exc).__name__}: {exc}")
        raise GeminiServiceError(
            f"Analysis service error: {type(exc).__name__}"
        ) from exc
