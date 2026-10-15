"""
Groq integration service for resume analysis.

Uses the official `groq` SDK in JSON mode and validates the output
against the AnalysisResult Pydantic model.
"""

from __future__ import annotations

import json
import os

from groq import AsyncGroq

from schemas.models import AnalysisResult


# Models are tried in order; falls back if one is rate limited / unavailable.
# (llama-3.3-70b-versatile and llama-3.1-8b-instant were shut down by Groq on Aug 16, 2026.)
_CANDIDATE_MODELS = [
    "openai/gpt-oss-120b",
    "qwen/qwen3.6-27b",
    "openai/gpt-oss-20b",
]

_JSON_TEMPLATE = """{
  "is_resume": true,
  "rejection_reason": "",
  "match_score": 0,
  "summary": "2-3 sentence overall assessment",
  "matched_keywords": ["keyword found in both JD and resume"],
  "missing_keywords": ["keyword in JD but NOT in resume"],
  "strengths": [{"point": "short headline", "detail": "one sentence with evidence"}],
  "gaps": [{"point": "short headline", "detail": "one sentence with evidence"}],
  "suggestions": ["actionable suggestion"],
  "ats_notes": "ATS formatting issues or 'None detected'",
  "impact_assessment": {
    "impact_score": 0,
    "summary": "1-2 sentence impact quality summary",
    "weak_bullets": [{"original": "verbatim weak bullet", "rewrite_suggestion": "results-oriented rewrite"}]
  },
  "soft_skills_assessment": {
    "summary": "1-2 sentence soft skills read",
    "demonstrated": [{"trait": "trait name", "evidence": "line from resume"}],
    "underrepresented": ["trait absent or under-evidenced"]
  },
  "interview_prep_questions": [
    {"question": "...", "rationale": "why this is asked", "model_answer": "first-person draft answer grounded in resume"}
  ]
}"""

_SYSTEM_INSTRUCTION = f"""You are an expert technical recruiter and hiring manager with deep experience evaluating resumes against job descriptions.

CRITICAL FIRST RULE — RESUME VERIFICATION:
First, inspect the uploaded RESUME text. Determine whether it is a genuine personal resume, CV, or professional work profile of an individual.
- If it is clearly NOT a resume (recipe, menu, invoice, essay, novel, news article, code script, legal agreement, random text, etc.):
  set is_resume to false and rejection_reason to "This is not a resume!".
  Fill other fields with minimal fallback values (match_score: 0, summary: "This is not a resume!", empty arrays, impact_score 0).
- If it IS a genuine resume, set is_resume to true, rejection_reason to "", and do a full evaluation.

EVALUATION RULES:
- Be honest and specific — do NOT inflate scores.
- Base every claim strictly on the resume text and job description provided; do NOT invent skills, metrics, or experience.
- match_score must be an integer 0-100 reflecting how well the resume fits the job description.
- impact_score must be an integer 0-100 rating how well the resume quantifies outcomes (%, $, time saved, team size, scale).
- For skill gaps, list ONLY technologies, tools, certifications, or qualifications stated or clearly implied by the job description that do NOT appear in the resume.
- For impact assessment, pull out specific weak bullet points VERBATIM from the resume and give a results-oriented rewrite for each.
- For soft skills, ground every claim in something actually written in the resume.
- For interview prep, act as the hiring manager for THIS role. Generate 3-5 tailored questions with rationale and model_answer.
- For ats_notes, flag formatting issues (tables, images, unusual fonts, missing standard section headers). If none, return "None detected".

OUTPUT FORMAT:
Respond with ONE valid JSON object only — no markdown, no commentary. It must follow exactly this structure and key names:
{_JSON_TEMPLATE}
"""


class GroqServiceError(Exception):
    """Raised when the Groq API call fails."""

    pass


async def analyze_resume(resume_text: str, job_description: str) -> AnalysisResult:
    """
    Send resume text and job description to Groq for analysis.

    Returns a validated AnalysisResult model.

    Raises
    ------
    GroqServiceError
        If the API call fails or returns malformed data.
    """
    from dotenv import load_dotenv

    load_dotenv(override=True)

    api_key = os.getenv("GROQ_API_KEY", "").strip().strip('"').strip("'")
    if not api_key:
        raise GroqServiceError("GROQ_API_KEY is not configured in .env")

    model_override = os.getenv("GROQ_MODEL", "").strip()
    models = [model_override] if model_override else _CANDIDATE_MODELS

    user_content = (
        f"--- RESUME ---\n{resume_text}\n\n"
        f"--- JOB DESCRIPTION ---\n{job_description}"
    )

    client = AsyncGroq(api_key=api_key)
    last_error: Exception | None = None

    for model_name in models:
        try:
            response = await client.chat.completions.create(
                model=model_name,
                messages=[
                    {"role": "system", "content": _SYSTEM_INSTRUCTION},
                    {"role": "user", "content": user_content},
                ],
                temperature=0.2,
                response_format={"type": "json_object"},
            )

            raw_text = response.choices[0].message.content
            if not raw_text:
                raise ValueError("Groq returned an empty response")

            data = json.loads(raw_text)
            return AnalysisResult.model_validate(data)

        except Exception as exc:
            print(f"[GROQ ERROR with {model_name}] {type(exc).__name__}: {exc}")
            last_error = exc
            continue

    detail = str(last_error) if last_error else "All candidate models failed"
    lowered = detail.lower()
    if "401" in detail or "invalid api key" in lowered or "invalid_api_key" in lowered:
        raise GroqServiceError(
            "Invalid GROQ_API_KEY. Create one at https://console.groq.com/keys (starts with 'gsk_')."
        )
    if "429" in detail or "rate limit" in lowered or "quota" in lowered:
        raise GroqServiceError(
            "Groq rate limit exceeded. Please wait a moment and try again."
        )

    raise GroqServiceError(f"{type(last_error).__name__}: {last_error}") from last_error
