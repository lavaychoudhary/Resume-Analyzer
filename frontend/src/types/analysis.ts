export interface StrengthOrGap {
  point: string;
  detail: string;
}

export interface WeakBullet {
  original: string;
  rewrite_suggestion: string;
}

export interface ImpactAssessment {
  impact_score: number;
  summary: string;
  weak_bullets: WeakBullet[];
}

export interface DemonstratedTrait {
  trait: string;
  evidence: string;
}

export interface SoftSkillsAssessment {
  summary: string;
  demonstrated: DemonstratedTrait[];
  underrepresented: string[];
}

export interface InterviewQuestion {
  question: string;
  rationale: string;
  model_answer: string;
}

export interface AnalysisResult {
  match_score: number;
  score_label: string;
  summary: string;
  matched_keywords: string[];
  missing_keywords: string[];
  strengths: StrengthOrGap[];
  gaps: StrengthOrGap[];
  suggestions: string[];
  ats_notes: string;
  impact_assessment: ImpactAssessment;
  soft_skills_assessment: SoftSkillsAssessment;
  interview_prep_questions: InterviewQuestion[];
}
