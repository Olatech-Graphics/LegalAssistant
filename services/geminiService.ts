import { GoogleGenAI, Type, Chat } from '@google/genai';
import type {
  RAGResult,
  CitizenAnalysisResult,
  PrecedentAnalysisResult,
  SimilarCaseAnalysisResult,
  CaseChatMessage,
  AIResearchPipelineResult,
  LegalDraftType,
  BiasAnalysisResult,
  NextStepsResponse,
  ArgumentBuilderResult,
} from '../types';

// FIX: Initialize Gemini AI Client according to coding guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

// FIX: Add helper to parse JSON from model's markdown response, making it more robust.
/**
 * Parses a JSON object from a markdown code block in a string.
 * It first tries to find a markdown block, and if not found, tries to parse the whole string.
 * @param markdown The string containing the markdown code block.
 * @returns The parsed JSON object.
 * @throws An error if the JSON is invalid or not found.
 */
const parseJsonFromMarkdown = <T>(markdown: string): T => {
  const trimmedMarkdown = markdown.trim();
  // Look for a JSON code block (with or without 'json' language identifier)
  const jsonMatch = trimmedMarkdown.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (jsonMatch && jsonMatch[1]) {
    try {
      return JSON.parse(jsonMatch[1]);
    } catch (e) {
      console.error('Failed to parse JSON from markdown:', jsonMatch[1]);
      throw new Error('Invalid JSON response from model.');
    }
  }
  // If no code block, try to parse the whole string as JSON
  try {
    return JSON.parse(trimmedMarkdown);
  } catch (e) {
    console.error('Failed to parse the entire string as JSON:', trimmedMarkdown);
    throw new Error('Invalid response from model. Expected a JSON object.');
  }
};

// Function for Citizen Dashboard
export const analyzeDispute = async (
  disputeText: string
): Promise<CitizenAnalysisResult> => {
  // FIX: Use gemini-2.5-pro for complex reasoning tasks
  const model = 'gemini-2.5-pro';
  const prompt = `Analyze the following legal dispute description and provide a structured JSON response.
  
  Dispute Description:
  ---
  ${disputeText}
  ---
  
  Based on the Indian legal context, provide the following:
  1.  "case_classification": A brief, high-level classification (e.g., "Civil - Property Dispute", "Criminal - Cheque Bounce", "Consumer Complaint").
  2.  "legal_domain": The primary area of Indian law involved (e.g., "Property Law", "Negotiable Instruments Act, 1881", "Consumer Protection Act, 2019").
  3.  "primary_issue": A concise statement of the main legal issue.
  4.  "legal_summary": A brief, easy-to-understand summary of the situation from a legal perspective.
  5.  "probable_remedy": An array of strings outlining the next steps for the user. Provide at least 2-3 clear, actionable steps in order. For example: ["Send a formal legal notice to the opposing party.", "If no response, file a complaint on the consumer portal.", "Prepare all relevant documents like receipts and communication records."].
  6.  "suggested_lawyer_type": The type of lawyer best suited for this case (e.g., "Civil Lawyer specializing in Property Disputes", "Corporate Lawyer").
  7.  "recommended_lawyers": An array of 3 fictional but realistic-looking lawyers. Each object should have "name", "specialization", "experience_years" (number), "success_rate" (string like "92%"), "location" (major Indian city), "profile_id" (a unique string), and "contact_option" ("Send Request").
  8.  "lawyer_request_summary": A one-paragraph summary of the case to be sent to a lawyer.
  9.  "urgency": Assess the urgency as "Low", "Medium", or "High".
  10. "portal_recommendation": Suggest a relevant government portal if applicable (e.g., "National Consumer Helpline (consumerhelpline.gov.in)", "State RERA portal"), otherwise "N/A".
  
  Ensure the entire output is a single valid JSON object.
  `;

  // FIX: Use generateContent with responseMimeType and responseSchema for robust JSON
  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          case_classification: { type: Type.STRING },
          legal_domain: { type: Type.STRING },
          primary_issue: { type: Type.STRING },
          legal_summary: { type: Type.STRING },
          probable_remedy: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          suggested_lawyer_type: { type: Type.STRING },
          recommended_lawyers: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                specialization: { type: Type.STRING },
                experience_years: { type: Type.INTEGER },
                success_rate: { type: Type.STRING },
                location: { type: Type.STRING },
                profile_id: { type: Type.STRING },
                contact_option: { type: Type.STRING },
              },
              required: [
                'name',
                'specialization',
                'experience_years',
                'success_rate',
                'location',
                'profile_id',
                'contact_option',
              ],
            },
          },
          lawyer_request_summary: { type: Type.STRING },
          urgency: { type: Type.STRING },
          portal_recommendation: { type: Type.STRING },
        },
        required: [
          'case_classification',
          'legal_domain',
          'primary_issue',
          'legal_summary',
          'probable_remedy',
          'suggested_lawyer_type',
          'recommended_lawyers',
          'lawyer_request_summary',
          'urgency',
          'portal_recommendation',
        ],
      },
    },
  });

  // FIX: Directly parse the text response as JSON
  return JSON.parse(response.text);
};

// Function for Precedent Search
export const performRAGSearch = async (
  query: string,
  documentText: string
): Promise<RAGResult> => {
  // FIX: Use gemini-2.5-flash for grounded Q&A tasks
  const model = 'gemini-2.5-flash';
  const prompt = `
    Context Document:
    ---
    ${documentText}
    ---
    
    Question: "${query}"
    
    Based ONLY on the context document provided, answer the question. Also, provide up to 3 direct quotes from the document that support your answer as citations.
    
    Format your response as a JSON object inside a markdown code block with the following structure:
    {
      "answer": "Your direct answer to the question.",
      "citations": [
        "Direct quote 1 from the document.",
        "Direct quote 2 from the document.",
        "Direct quote 3 from the document."
      ]
    }
  `;

  // FIX: Use standard generateContent and parse the JSON response
  const response = await ai.models.generateContent({ model, contents: prompt });
  return parseJsonFromMarkdown<RAGResult>(response.text);
};

// Function for Explainable AI
export const getPrecedentAnalysis = async (
  documentText: string
): Promise<PrecedentAnalysisResult> => {
  // FIX: Use gemini-2.5-pro for complex analysis
  const model = 'gemini-2.5-pro';
  const prompt = `
      Analyze the following legal document (likely a court judgment) from an Indian legal perspective.
  
      Document:
      ---
      ${documentText}
      ---
  
      Provide a detailed analysis in a JSON object format within a markdown code block. The JSON object should have the following keys:
      1.  "keyArguments": An object with two keys, "plaintiff" and "defendant", containing a concise summary of the main arguments for each side as presented in the document.
      2.  "influencingStatutes": An array of objects. Each object should represent a key statute or precedent cited and should have three keys: "statute" (the name of the law or case), "quote" (a brief, relevant quote from the document about it), and "relevance" (a short explanation of its importance to the case).
      3.  "consistencyCheck": An array of objects. Identify any potential logical inconsistencies or contradictions in the judgment's reasoning. Each object should have "issue" (a brief title for the inconsistency) and "explanation" (a description of the inconsistency). If none are found, return an empty array.
      4.  "biasDetection": An object with a single key "warning". Briefly state if any potential judicial bias (e.g., confirmation bias, gender bias) is apparent from the language used. If none, state "No potential bias detected in the provided text."
    `;
  // FIX: Use standard generateContent and parse the JSON response
  const response = await ai.models.generateContent({ model, contents: prompt });
  return parseJsonFromMarkdown<PrecedentAnalysisResult>(response.text);
};

// Function for Similar Case Analyzer
export const getSimilarCases = async (
  caseFacts: string
): Promise<SimilarCaseAnalysisResult> => {
  // FIX: Use gemini-2.5-pro for creative and analytical tasks
  const model = 'gemini-2.5-pro';
  const prompt = `
      Analyze the following case facts from the perspective of an Indian advocate. Find 3-4 similar but fictional Indian case laws that would be relevant.
  
      Case Facts:
      ---
      ${caseFacts}
      ---
  
      Provide the output as a JSON object inside a markdown block with the following structure:
      {
        "role": "Advocate",
        "feature": "Similar Case Analyzer",
        "case_context_summary": "A brief summary of the user's provided case facts.",
        "similar_cases_found": [
          {
            "case_title": "Fictional Case Title (e.g., 'Rajesh Kumar vs. State of Delhi')",
            "citation_or_year": "Fictional citation (e.g., 'AIR 2018 SC 1234' or '2019')",
            "court_name": "Fictional Court Name (e.g., 'Supreme Court of India', 'High Court of Bombay')",
            "summary_of_decision": "A concise summary of the fictional case's ruling.",
            "relevance_score": a number between 0.70 and 0.99 representing relevance to the user's case,
            "key_sections_cited": ["Section 138 NI Act", "Section 420 IPC"],
            "legal_takeaway": "A one-sentence key legal principle derived from this case."
          }
        ],
        "overall_summary": "A brief overall summary of what the similar cases suggest.",
        "suggested_action": "A concrete next step for the advocate based on the findings."
      }
    `;
  // FIX: Use standard generateContent and parse the JSON response
  const response = await ai.models.generateContent({ model, contents: prompt });
  return parseJsonFromMarkdown<SimilarCaseAnalysisResult>(response.text);
};

// Function for Argument Builder
export const generateArguments = async (
  caseFacts: string,
  desiredOutcome: string,
  legalStance: 'Plaintiff' | 'Defendant'
): Promise<ArgumentBuilderResult> => {
  // Use gemini-2.5-pro for complex strategic tasks
  const model = 'gemini-2.5-pro';
  const prompt = `
    As an expert legal strategist in the Indian legal system, analyze the following case details and construct a structured legal argument.

    **Case Facts:**
    ---
    ${caseFacts}
    ---

    **My Legal Stance:** ${legalStance}

    **Desired Outcome:** ${desiredOutcome}

    ---

    Generate a comprehensive JSON object with the following structure:
    1.  "core_argument": A single, powerful sentence summarizing the central legal argument.
    2.  "supporting_points": An array of 3-4 key points that build upon the core argument. Each object in the array should have:
        - "point": A concise heading for the supporting argument.
        - "explanation": A brief paragraph explaining the point, referencing the case facts.
    3.  "potential_counter_arguments": An array of 2-3 likely arguments the opposing counsel might raise. Each object should have:
        - "argument": The potential counter-argument.
        - "rebuttal": A strategic rebuttal to that counter-argument.
    4.  "evidence_checklist": An array of strings listing crucial pieces of evidence that need to be collected or presented to support the arguments (e.g., "Signed contract dated DD/MM/YYYY", "Witness testimony from [Witness Name]").
    5.  "suggested_precedents": An array of 2-3 strings, each being a fictional but realistic-sounding Indian legal precedent that supports the argument (e.g., "State of Maharashtra vs. Ajay Singh, (2018) 5 SCC 342").
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          core_argument: { type: Type.STRING },
          supporting_points: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                point: { type: Type.STRING },
                explanation: { type: Type.STRING },
              },
              required: ['point', 'explanation'],
            },
          },
          potential_counter_arguments: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                argument: { type: Type.STRING },
                rebuttal: { type: Type.STRING },
              },
              required: ['argument', 'rebuttal'],
            },
          },
          evidence_checklist: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          suggested_precedents: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
        },
        required: [
          'core_argument',
          'supporting_points',
          'potential_counter_arguments',
          'evidence_checklist',
          'suggested_precedents',
        ],
      },
    },
  });

  return JSON.parse(response.text);
};

// Function for Case Chat Summary
export const getChatSummary = async (
  history: CaseChatMessage[]
): Promise<string> => {
  // FIX: Use gemini-2.5-flash for summarization
  const model = 'gemini-2.5-flash';
  const chatHistoryText = history.map((m) => `${m.role}: ${m.text}`).join('\n');
  const prompt = `Summarize the following conversation between an advocate and a citizen. Be concise and focus on the key legal points and actions agreed upon.
  
  Conversation:
  ---
  ${chatHistoryText}
  ---
  
  Summary:
  `;

  // FIX: Use generateContent and return the text property
  const response = await ai.models.generateContent({ model, contents: prompt });
  return response.text;
};

// Function for Case Chat Next Steps
export const getSuggestedNextSteps = async (
  history: CaseChatMessage[]
): Promise<NextStepsResponse> => {
  // FIX: Use gemini-2.5-flash for quick suggestions
  const model = 'gemini-2.5-flash';
  const chatHistoryText = history.map((m) => `${m.role}: ${m.text}`).join('\n');
  const prompt = `
    Based on the following chat between an advocate and a citizen, suggest 2-3 concrete next steps for the advocate.
    If the advocate needs to ask for more information, provide a "clarification_needed" question instead of suggestions.
    
    Chat History:
    ---
    ${chatHistoryText}
    ---
    
    Provide your response as a JSON object inside a markdown block with the following structure:
    {
      "suggestions": ["Step 1...", "Step 2..."] | null,
      "clarification_needed": "Question to ask the citizen for more details." | null
    }
    
    Only provide either suggestions OR a clarification question, not both.
  `;

  // FIX: Use standard generateContent and parse the JSON response
  const response = await ai.models.generateContent({ model, contents: prompt });
  return parseJsonFromMarkdown<NextStepsResponse>(response.text);
};

// Function for AI Research Hub
export const getAIResearchSummary = async (
  caseFacts: string,
  similarCases: SimilarCaseAnalysisResult,
  ragResult: RAGResult
): Promise<AIResearchPipelineResult> => {
  // FIX: Use gemini-2.5-pro for complex synthesis
  const model = 'gemini-2.5-pro';
  const prompt = `
      You are an AI legal assistant. Synthesize the provided information into a final research summary for an advocate.
  
      1. Original Case Facts:
      ---
      ${caseFacts}
      ---
  
      2. Similar Cases Found:
      ---
      ${JSON.stringify(similarCases.similar_cases_found, null, 2)}
      ---
      
      3. Relevant Statutes from RAG search:
      ---
      ${JSON.stringify(ragResult, null, 2)}
      ---
  
      Based on all the above information, generate a final JSON object inside a markdown block with the following structure:
      {
        "pipeline_stage": "Complete",
        "case_context": "A brief, one-paragraph summary of the original case facts.",
        "similar_cases": [
          {
            "case_title": "Title from input",
            "court_name": "Court from input",
            "citation": "Citation from input",
            "relevance_score": 0.85
          }
        ],
        "rag_results": [
          {
            "section": "Statute/Section Name from RAG",
            "summary": "Brief summary of the statute's relevance."
          }
        ],
        "final_summary": "A comprehensive final summary synthesizing the findings from similar cases and RAG results, providing an outlook on the case strength.",
        "argument_suggestion": "Suggest a single, powerful core argument the advocate should focus on."
      }
    `;

  // FIX: Use standard generateContent and parse the JSON response
  const response = await ai.models.generateContent({ model, contents: prompt });
  return parseJsonFromMarkdown<AIResearchPipelineResult>(response.text);
};

// Function for Bias Monitor
export const monitorForBias = async (
  documentText: string
): Promise<BiasAnalysisResult> => {
  // FIX: Use gemini-2.5-pro for nuanced bias detection
  const model = 'gemini-2.5-pro';
  const prompt = `
      Analyze the following text for potential biases (e.g., gender, confirmation, racial, socioeconomic) or AI hallucinations (factually incorrect statements presented as fact).
  
      Text to Analyze:
      ---
      ${documentText}
      ---
  
      Provide the analysis as a JSON object inside a markdown block. The structure should be:
      {
        "has_bias": false,
        "findings": [
          {
            "phrase": "The exact phrase or sentence that is problematic.",
            "bias_type": "The type of bias (e.g., 'Gender Bias', 'Confirmation Bias', 'Potential Hallucination').",
            "explanation": "A brief explanation of why this phrase is flagged.",
            "suggestion": "A suggestion for a more neutral rephrasing."
          }
        ]
      }
  
      If no biases are found, "has_bias" should be false and "findings" should be an empty array.
    `;
  // FIX: Use standard generateContent and parse the JSON response
  const response = await ai.models.generateContent({ model, contents: prompt });
  return parseJsonFromMarkdown<BiasAnalysisResult>(response.text);
};

// Function for Legal Draft Generator
export const generateLegalDraft = async (
  draftType: LegalDraftType,
  caseContext: string,
  keyPoints: string
): Promise<string> => {
  // FIX: Use gemini-2.5-pro for high-quality text generation
  const model = 'gemini-2.5-pro';
  const prompt = `
      Generate a professional legal draft for a "${draftType}" based on Indian legal standards.
  
      Case Context:
      ---
      ${caseContext}
      ---
  
      Key Points to Include:
      ---
      ${keyPoints}
      ---
      
      Please generate the full text of the ${draftType}. Ensure it is well-structured, uses appropriate legal terminology, and incorporates all the key points provided. Do not wrap the output in markdown or JSON, just provide the raw text of the draft.
    `;

  // FIX: Use generateContent and return the text property
  const response = await ai.models.generateContent({ model, contents: prompt });
  return response.text;
};

// Function for Chatbot
export const createChatSession = (systemInstruction?: string): Chat => {
  const model = 'gemini-2.5-flash';
  return ai.chats.create({
    model,
    config: {
      systemInstruction: systemInstruction || "You are a helpful legal assistant chatbot for the AI Justice Hub. Your goal is to provide general legal information and guidance based on Indian law. Do not provide legal advice. If a user asks for legal advice, you must tell them to consult with a qualified lawyer.",
    },
  });
};