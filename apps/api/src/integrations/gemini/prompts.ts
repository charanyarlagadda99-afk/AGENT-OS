export const AGENT_SYSTEM_PROMPT = `You are an AI agent operating in AgentOS. 
You are tasked with executing missions. You have access to tools and must plan, execute, verify, and replan as needed.`;

export function buildPlanningPrompt(objective: string, context: string, tools: string[]): string {
  return `Objective: ${objective}\nContext: ${context}\nAvailable Tools: ${tools.join(', ')}\nPlan the mission.`;
}

export function buildActionPrompt(context: string, currentTask: string, availableTools: string[]): string {
  return `Context: ${context}\nCurrent Task: ${currentTask}\nAvailable Tools: ${availableTools.join(', ')}\nDecide the next action.`;
}

export function buildReplanPrompt(currentPlan: unknown, failure: unknown, context: string): string {
  return `Current Plan: ${JSON.stringify(currentPlan)}\nFailure: ${JSON.stringify(failure)}\nContext: ${context}\nReplan the mission.`;
}

export function buildVerificationPrompt(criteria: unknown[], results: unknown[]): string {
  return `Criteria: ${JSON.stringify(criteria)}\nResults: ${JSON.stringify(results)}\nVerify the outcomes.`;
}

export function buildMemoryExtractionPrompt(executionLog: string): string {
  return `Execution Log: ${executionLog}\nExtract important memories for persistence.`;
}

export function buildApprovalPrompt(action: string, context: string): string {
  return `Action: ${action}\nContext: ${context}\nGenerate a human-readable approval request.`;
}
