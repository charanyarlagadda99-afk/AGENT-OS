import { Type, Schema } from '@google/genai';

export const MissionPlanSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    tasks: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          description: { type: Type.STRING },
          dependencies: { type: Type.ARRAY, items: { type: Type.STRING } },
          priority: { type: Type.INTEGER }
        },
        required: ['id', 'description', 'dependencies', 'priority']
      }
    }
  },
  required: ['tasks']
};

export const NextActionSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    actionType: { type: Type.STRING, description: 'TOOL_CALL, CREATE_TASK, WAIT, REQUEST_APPROVAL, REPLAN, COMPLETE' },
    toolName: { type: Type.STRING },
    toolArgs: { type: Type.OBJECT },
    reasoning: { type: Type.STRING }
  },
  required: ['actionType', 'reasoning']
};

export const ReplanDecisionSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    tasksToAdd: { type: Type.ARRAY, items: { type: Type.OBJECT } },
    tasksToRemove: { type: Type.ARRAY, items: { type: Type.STRING } },
    reasoning: { type: Type.STRING }
  },
  required: ['tasksToAdd', 'tasksToRemove', 'reasoning']
};

export const VerificationResultSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    success: { type: Type.BOOLEAN },
    failedCriteria: { type: Type.ARRAY, items: { type: Type.STRING } },
    reasoning: { type: Type.STRING }
  },
  required: ['success', 'failedCriteria', 'reasoning']
};

export const MemoryExtractionSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    memories: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          content: { type: Type.STRING },
          importance: { type: Type.INTEGER }
        },
        required: ['content', 'importance']
      }
    }
  },
  required: ['memories']
};

export const ApprovalRequestSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    summary: { type: Type.STRING },
    details: { type: Type.STRING },
    riskLevel: { type: Type.STRING }
  },
  required: ['summary', 'details', 'riskLevel']
};
