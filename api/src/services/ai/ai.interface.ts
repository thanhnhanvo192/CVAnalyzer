export interface MatchedSkill {
  skill: string;
  evidence: string;
}

export interface MissingSkill {
  skill: string;
  importance: "HIGH" | "MEDIUM" | "LOW";
  reason: string;
}

export interface MatchAnalysisResult {
  overallScore: number; // 0 - 100
  summary: string;
  matchedSkills: MatchedSkill[];
  missingSkills: MissingSkill[];
  recommendations: string[];
}

export interface AIProvider {
  readonly name: string;
  matchCvToJob(cvText: string, jdText: string): Promise<MatchAnalysisResult>;
}
