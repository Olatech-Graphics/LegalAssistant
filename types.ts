import { Chat } from "@google/genai";

// FIX: Add shared application types to centralize them.
export type UserRole = 'citizen' | 'advocate' | 'judge';
export type ViewType = 'dashboard' | 'search' | 'builder' | 'analytics' | 'workspace' | 'case_filing' | 'airesearch' | 'similarcases' | 'aidrafts' | 'calendar';
export type Theme = 'light' | 'dark';
export type Language = 'en' | 'hi' | 'bn' | 'mr' | 'ta' | 'te' | 'kn';

export interface RAGResult {
  answer: string;
  citations: string[];
}

// New type for the recommended lawyers in the citizen analysis
export interface RecommendedLawyer {
  name: string;
  specialization: string;
  experience_years: number;
  success_rate: string;
  location: string;
  profile_id: string;
  contact_option: string; // Should be "Send Request"
}

// Updated type for Citizen Dashboard based on user's request
export interface CitizenAnalysisResult {
  case_classification: string;
  legal_domain: string;
  primary_issue: string;
  legal_summary: string;
  probable_remedy: string[];
  suggested_lawyer_type: string;
  recommended_lawyers: RecommendedLawyer[];
  lawyer_request_summary: string;
  urgency: string;
  portal_recommendation: string;
}


export interface GeneralChatMessage {
  sender: 'user' | 'bot';
  text: string;
}

export interface CaseChatMessage {
  id: string;
  caseId: string;
  role: 'citizen' | 'advocate';
  text: string;
  timestamp: string;
}

// FIX: Add missing Lawyer interface for LawyerCard.tsx
export interface Lawyer {
  name: string;
  specialization: string;
  location: string;
  successRate: string;
  contact: string;
}

// Phase 3: Types for Explainable AI Dashboard
export interface InfluencingStatute {
  statute: string;
  quote: string;
  relevance: string;
}

export interface ConsistencyCheck {
  issue: string;
  explanation: string;
}

export interface BiasDetection {
  warning: string;
}

export interface PrecedentAnalysisResult {
  keyArguments: {
    plaintiff: string;
    defendant: string;
  };
  influencingStatutes: InfluencingStatute[];
  consistencyCheck: ConsistencyCheck[];
  biasDetection: BiasDetection;
}


// Phase 3: Types for Judicial Analytics
export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
    borderColor?: string[];
    borderWidth?: number;
  }[];
}

// Advocate: Types for Similar Case Analyzer
export interface SimilarCase {
  case_title: string;
  citation_or_year: string;
  court_name: string;
  summary_of_decision: string;
  relevance_score: number;
  key_sections_cited: string[];
  legal_takeaway: string;
}

export interface SimilarCaseAnalysisResult {
  role: "Advocate";
  feature: "Similar Case Analyzer";
  case_context_summary: string;
  similar_cases_found: SimilarCase[];
  overall_summary: string;
  suggested_action: string;
}

// Advocate: Types for Case Request Management
export interface CaseRequest {
    id: string;
    userName: string;
    caseSummary: string;
    legalDomain: string;
    urgency: 'Low' | 'Medium' | 'High';
    status: 'Pending' | 'Accepted' | 'Rejected';
    timestamp: string;
}

// Advocate: Types for AI Legal Research Pipeline
export interface AIResearchPipelineResult {
  pipeline_stage: "Complete";
  case_context: string;
  similar_cases: {
    case_title: string;
    court_name: string;
    citation: string;
    relevance_score: number;
  }[];
  rag_results: {
    section: string;
    summary: string;
  }[];
  final_summary: string;
  argument_suggestion: string;
}

// Advocate: Types for Argument Builder
export interface SupportingPoint {
  point: string;
  explanation: string;
}

export interface CounterArgument {
  argument: string;
  rebuttal: string;
}

export interface ArgumentBuilderResult {
  core_argument: string;
  supporting_points: SupportingPoint[];
  potential_counter_arguments: CounterArgument[];
  evidence_checklist: string[];
  suggested_precedents: string[];
}

// ADD-ON: AI Legal Draft Generator
export type LegalDraftType = 'Affidavit' | 'Cease and Desist' | 'Legal Notice' | 'Vakalatnama';

// ADD-ON: AI Bias Monitor
export interface BiasAnalysisResult {
    has_bias: boolean;
    findings: {
        phrase: string;
        bias_type: string;
        explanation: string;
        suggestion: string;
    }[];
}

// ADD-ON: Real-Time Notifications
export interface AppNotification {
    id: number;
    icon: 'case' | 'draft' | 'system';
    message: string;
    timestamp: string;
    read: boolean;
}

// ADD-ON: AI Chat Suggestions
export interface NextStepsResponse {
    suggestions: string[];
    clarification_needed: string | null;
}