"""
Pydantic models for the AI Resume Analyzer API.

Defines the response schema for the Gemini analysis and is also used
to build the Gemini `response_schema` so the API contract and LLM
output contract can never drift apart.
"""

from __future__ import annotations

from pydantic import BaseModel, Field, model_validator


# ── Nested models ──────────────────────────────────────────────────────────


class StrengthGap(BaseModel):
    """A single strength or gap item."""

    point: str = Field(..., description="Short headline of the strength or gap")
    detail: str = Field(
        ..., description="One-sentence elaboration with evidence from the resume"
    )


class WeakBullet(BaseModel):
    """A weak resume bullet paired with a rewritten version."""

    original: str = Field(
        ...,
        description="The exact bullet point text from the resume that is weak",
    )
    rewrite_suggestion: str = Field(
        ...,
        description="A results-oriented rewrite of the bullet with quantified impact",
    )


class ImpactAssessment(BaseModel):
    """Assessment of quantifiable impact in resume bullet points."""

    impact_score: int = Field(
        ...,
        ge=0,
        le=100,
        description="0-100 score rating how well the resume quantifies outcomes",
    )
    summary: str = Field(
        ...,
        description="1-2 sentence summary of the impact quality across all bullets",
    )
    weak_bullets: list[WeakBullet] = Field(
        default_factory=list,
        description="Specific weak bullet points with suggested rewrites",
    )


class DemonstratedTrait(BaseModel):
    """A soft skill or leadership trait with supporting evidence."""

    trait: str = Field(..., description="Name of the demonstrated trait")
    evidence: str = Field(
        ...,
        description="The specific line or context from the resume demonstrating this trait",
    )


class SoftSkillsAssessment(BaseModel):
    """Assessment of soft skills and leadership signals."""

    summary: str = Field(
        ...,
        description="1-2 sentence overall read on communication, leadership, and teamwork signals",
    )
    demonstrated: list[DemonstratedTrait] = Field(
        default_factory=list,
        description="Traits that are well-demonstrated with evidence",
    )
    underrepresented: list[str] = Field(
        default_factory=list,
        description="Traits that are absent or under-evidenced in the resume",
    )


class InterviewQuestion(BaseModel):
    """A tailored interview prep question with rationale and model answer."""

    question: str = Field(..., description="The interview question")
    rationale: str = Field(
        ...,
        description="One-line explanation of why this question is being asked",
    )
    model_answer: str = Field(
        ...,
        description="A first-person draft answer grounded in the candidate's actual resume content",
    )


# ── Top-level response model ──────────────────────────────────────────────


class AnalysisResult(BaseModel):
    """Complete resume analysis result returned by the API."""

    match_score: int = Field(
        ..., ge=0, le=100, description="Overall match score 0-100"
    )
    score_label: str = Field(
        default="",
        description="Human-readable label derived from match_score (computed in code, not by the model)",
    )
    summary: str = Field(
        ..., description="2-3 sentence overall assessment of the match"
    )
    matched_keywords: list[str] = Field(
        default_factory=list,
        description="Keywords/skills from the job description found in the resume",
    )
    missing_keywords: list[str] = Field(
        default_factory=list,
        description="Keywords/skills from the job description NOT found in the resume",
    )
    strengths: list[StrengthGap] = Field(
        default_factory=list,
        description="Key strengths the candidate has for this role",
    )
    gaps: list[StrengthGap] = Field(
        default_factory=list,
        description="Key gaps between the candidate and the role requirements",
    )
    suggestions: list[str] = Field(
        default_factory=list,
        description="Actionable suggestions to improve the resume for this role",
    )
    ats_notes: str = Field(
        default="None detected",
        description="Formatting issues that could trip up an ATS, or 'None detected'",
    )
    impact_assessment: ImpactAssessment = Field(
        ..., description="Assessment of quantifiable impact in resume bullets"
    )
    soft_skills_assessment: SoftSkillsAssessment = Field(
        ..., description="Assessment of soft skills and leadership signals"
    )
    interview_prep_questions: list[InterviewQuestion] = Field(
        ...,
        min_length=3,
        max_length=5,
        description="3-5 tailored interview prep questions for this specific role",
    )

    @model_validator(mode="after")
    def compute_score_label(self) -> "AnalysisResult":
        """Derive score_label from match_score so they never disagree."""
        score = self.match_score
        if score >= 85:
            self.score_label = "Excellent Match"
        elif score >= 70:
            self.score_label = "Strong Match"
        elif score >= 50:
            self.score_label = "Moderate Match"
        else:
            self.score_label = "Weak Match"
        return self
