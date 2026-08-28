import { GoogleGenAI } from '@google/genai';
import { 
  AGENT_SYSTEM_PROMPT, 
  buildPlanningPrompt, 
  buildActionPrompt, 
  buildReplanPrompt, 
  buildVerificationPrompt, 
  buildMemoryExtractionPrompt, 
  buildApprovalPrompt 
} from './prompts.js';
import { 
  MissionPlanSchema, 
  NextActionSchema, 
  ReplanDecisionSchema, 
  VerificationResultSchema, 
  MemoryExtractionSchema, 
  ApprovalRequestSchema 
} from './schemas.js';
import type { 
  MissionPlan, 
  NextAction, 
  VerificationResult, 
  ReplanDecision, 
  MemoryExtraction, 
  ApprovalRequest,
  ExecutionContext
} from '@agentos/shared';

export class GeminiProvider {
  private ai: GoogleGenAI;
  private model: string;

  constructor(apiKey: string, defaultModel: string) {
    this.ai = new GoogleGenAI({ apiKey });
    this.model = defaultModel;
  }

  async planMission(objective: string, context: string, tools: string[]): Promise<MissionPlan> {
    const response = await this.ai.models.generateContent({
      model: this.model,
      contents: buildPlanningPrompt(objective, context, tools),
      config: {
        systemInstruction: AGENT_SYSTEM_PROMPT,
        responseMimeType: 'application/json',
        responseSchema: MissionPlanSchema
      }
    });
    return JSON.parse(response.text || '{}') as MissionPlan;
  }

  async selectNextAction(context: ExecutionContext, missionObjective: string, currentState: string): Promise<NextAction> {
    const response = await this.ai.models.generateContent({
      model: this.model,
      contents: buildActionPrompt(JSON.stringify(context), currentState, []),
      config: {
        systemInstruction: AGENT_SYSTEM_PROMPT,
        responseMimeType: 'application/json',
        responseSchema: NextActionSchema
      }
    });
    return JSON.parse(response.text || '{}') as NextAction;
  }

  async analyzeToolResult(toolName: string, result: unknown, taskContext: string): Promise<string> {
    const response = await this.ai.models.generateContent({
      model: this.model,
      contents: `Analyze result of ${toolName}: ${JSON.stringify(result)}\nContext: ${taskContext}`,
      config: {
        systemInstruction: AGENT_SYSTEM_PROMPT
      }
    });
    return response.text || '';
  }

  async replanMission(currentPlan: unknown, failure: unknown, context: string): Promise<ReplanDecision> {
    const response = await this.ai.models.generateContent({
      model: this.model,
      contents: buildReplanPrompt(currentPlan, failure, context),
      config: {
        systemInstruction: AGENT_SYSTEM_PROMPT,
        responseMimeType: 'application/json',
        responseSchema: ReplanDecisionSchema
      }
    });
    return JSON.parse(response.text || '{}') as ReplanDecision;
  }

  async verify(criteria: unknown[], results: unknown[]): Promise<VerificationResult> {
    const response = await this.ai.models.generateContent({
      model: this.model,
      contents: buildVerificationPrompt(criteria, results),
      config: {
        systemInstruction: AGENT_SYSTEM_PROMPT,
        responseMimeType: 'application/json',
        responseSchema: VerificationResultSchema
      }
    });
    return JSON.parse(response.text || '{}') as VerificationResult;
  }

  async extractMemories(executionLog: string): Promise<MemoryExtraction> {
    const response = await this.ai.models.generateContent({
      model: this.model,
      contents: buildMemoryExtractionPrompt(executionLog),
      config: {
        systemInstruction: AGENT_SYSTEM_PROMPT,
        responseMimeType: 'application/json',
        responseSchema: MemoryExtractionSchema
      }
    });
    return JSON.parse(response.text || '{}') as MemoryExtraction;
  }

  async generateApprovalRequest(action: string, context: string): Promise<ApprovalRequest> {
    const response = await this.ai.models.generateContent({
      model: this.model,
      contents: buildApprovalPrompt(action, context),
      config: {
        systemInstruction: AGENT_SYSTEM_PROMPT,
        responseMimeType: 'application/json',
        responseSchema: ApprovalRequestSchema
      }
    });
    return JSON.parse(response.text || '{}') as ApprovalRequest;
  }
}
