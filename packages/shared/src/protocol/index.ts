import type { AgentMessageType } from '../constants/index.js';

// ─── Agent-to-Agent Communication Protocol ───
export interface AgentMessage {
  id: string;
  fromAgent: string;
  toAgent: string;
  messageType: AgentMessageType;
  payload: Record<string, unknown>;
  timestamp: string;
}

// ─── SSE Event Payload ───
export interface SSEEvent {
  type: string;
  data: Record<string, unknown>;
  timestamp: string;
}

// ─── File Tree Node ───
export interface FileTreeNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  size?: number;
  children?: FileTreeNode[];
}

// ─── Tool Call Protocol ───
export interface ToolCallRequest {
  toolName: string;
  arguments: Record<string, unknown>;
  reason: string;
  idempotencyKey: string;
}

export interface ToolCallResponse {
  success: boolean;
  output: Record<string, unknown>;
  error?: string;
  durationMs: number;
}

// ─── Execution Context ───
export interface ExecutionContext {
  missionId: string;
  agentId: string;
  runId: string;
  organizationId: string;
  currentTaskId?: string;
  stepNumber: number;
  availableTools: string[];
  memories: Array<{ content: string; type: string }>;
  taskGraph: Array<{ id: string; title: string; status: string; dependencies: string[] }>;
  workspacePath: string;
}
