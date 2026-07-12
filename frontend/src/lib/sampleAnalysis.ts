import type { AnalysisResult } from "../types/analysis";

export const sampleAnalysis: AnalysisResult = {
  match_score: 78,
  score_label: "Strong Match",
  summary:
    "This candidate covers most of the core technical requirements and has relevant backend experience, but the resume undersells its impact and leaves a few key tools unaddressed.",
  matched_keywords: ["Python", "FastAPI", "PostgreSQL", "AWS", "Docker", "REST APIs"],
  missing_keywords: ["Terraform", "Kubernetes", "GraphQL"],
  strengths: [
    {
      point: "Solid backend ownership",
      detail: "Led two full-stack service migrations end to end, matching the JD's request for someone who can own a service independently.",
    },
    {
      point: "Cloud-native experience",
      detail: "Direct AWS and Docker experience lines up with the infrastructure section of the job description.",
    },
  ],
  gaps: [
    {
      point: "No infrastructure-as-code experience listed",
      detail: "The JD asks for Terraform specifically; nothing on the resume indicates exposure to it.",
    },
    {
      point: "Limited evidence of cross-team collaboration",
      detail: "Most bullet points describe solo ownership rather than working across product or design.",
    },
  ],
  suggestions: [
    "Add a line quantifying the outcome of the service migration (latency, cost, or reliability improvement).",
    "If any Terraform or IaC exposure exists, even minor, surface it explicitly — it's a named requirement.",
    "Mention any cross-functional work with product or design to round out the collaboration signal.",
  ],
  ats_notes: "Resume uses a two-column layout with icons, which can scramble parsing order in some ATS systems. Consider a single-column layout for the version submitted to this role.",
  impact_assessment: {
    impact_score: 46,
    summary:
      "Most bullet points describe responsibilities rather than measurable outcomes. Rewriting a handful of these would meaningfully strengthen the resume.",
    weak_bullets: [
      {
        original: "Worked on improving efficiency of backend services",
        rewrite_suggestion: "Reduced backend service response time by 22% by refactoring the query layer and adding targeted caching",
      },
      {
        original: "Responsible for deploying applications to AWS",
        rewrite_suggestion: "Migrated 6 production services to AWS ECS, cutting deployment time from 40 minutes to under 5",
      },
    ],
  },
  soft_skills_assessment: {
    summary: "The resume shows some ownership and initiative, but collaboration and communication are largely unaddressed.",
    demonstrated: [
      {
        trait: "Ownership",
        evidence: "Owned the migration of the billing service from legacy infrastructure end to end.",
      },
      {
        trait: "Initiative",
        evidence: "Proposed and implemented a caching layer that was not part of the original project scope.",
      },
    ],
    underrepresented: [
      "No mention of mentoring, reviewing others' work, or cross-team communication.",
      "No indication of how decisions were communicated to non-technical stakeholders.",
    ],
  },
  interview_prep_questions: [
    {
      question: "You mention migrating the billing service off legacy infrastructure — what was the riskiest part of that migration, and how did you de-risk it?",
      rationale: "Tests depth behind a high-impact but under-detailed claim on the resume.",
      model_answer:
        "The riskiest part was cutting over live billing data without downtime. I mitigated this by running the old and new systems in parallel for two weeks, comparing outputs nightly, and using a feature flag to roll the cutover out to a small percentage of traffic before going to 100%.",
    },
    {
      question: "The job requires Terraform experience, which isn't listed on your resume. Have you worked with infrastructure-as-code tools?",
      rationale: "Directly probes the missing-skills gap identified in the analysis.",
      model_answer:
        "I haven't used Terraform directly, but I've worked closely with CloudFormation for provisioning the ECS services I mentioned, and I'm comfortable with the underlying IaC concepts. I'd expect to be productive in Terraform within a couple of weeks.",
    },
    {
      question: "Walk me through a time you had to explain a technical tradeoff to a non-technical stakeholder.",
      rationale: "Addresses the underrepresented communication/collaboration signal from the soft skills assessment.",
      model_answer:
        "When migrating the billing service, I had to explain to the finance team why we needed a two-week parallel-run period before cutover. I framed it in terms of risk to their monthly close process rather than technical detail, which got buy-in quickly.",
    },
  ],
};
