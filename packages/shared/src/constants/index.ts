// ─── Agent States ───
export const AGENT_STATES = [
  'IDLE',
  'PLANNING',
  'RUNNING',
  'PAUSED',
  'WAITING_APPROVAL',
  'FAILED',
  'COMPLETED',
  'TERMINATED',
] as const;
export type AgentState = (typeof AGENT_STATES)[number];

// ─── Mission States ───
export const MISSION_STATES = [
  'QUEUED',
  'PLANNING',
  'RUNNING',
  'WAITING',
  'PAUSED',
  'VERIFYING',
  'COMPLETED',
  'FAILED',
  'CANCELLED',
] as const;
export type MissionState = (typeof MISSION_STATES)[number];

// ─── Task States ───
export const TASK_STATES = [
  'PENDING',
  'READY',
  'RUNNING',
  'COMPLETED',
  'FAILED',
  'SKIPPED',
  'BLOCKED',
] as const;
export type TaskState = (typeof TASK_STATES)[number];

// ─── Run States ───
export const RUN_STATES = [
  'RUNNING',
  'COMPLETED',
  'FAILED',
  'PAUSED',
  'TERMINATED',
] as const;
export type RunState = (typeof RUN_STATES)[number];

// ─── Step Types ───
export const STEP_TYPES = [
  'PLAN',
  'TOOL_CALL',
  'OBSERVATION',
  'REPLAN',
  'VERIFICATION',
  'CHECKPOINT',
  'APPROVAL_REQUEST',
  'COMPLETION',
  'ERROR',
] as const;
export type StepType = (typeof STEP_TYPES)[number];

// ─── Autonomy Levels ───
export const AUTONOMY_LEVELS = [
  'SUPERVISED',
  'CONFIRMED',
  'AUTONOMOUS',
] as const;
export type AutonomyLevel = (typeof AUTONOMY_LEVELS)[number];

// ─── Risk Levels ───
export const RISK_LEVELS = [
  'LOW',
  'MEDIUM',
  'HIGH',
  'CRITICAL',
] as const;
export type RiskLevel = (typeof RISK_LEVELS)[number];

// ─── Side Effect Types ───
export const SIDE_EFFECT_TYPES = [
  'READ_ONLY',
  'LOW_RISK_WRITE',
  'HIGH_RISK_WRITE',
  'DESTRUCTIVE',
] as const;
export type SideEffectType = (typeof SIDE_EFFECT_TYPES)[number];

// ─── Permission Scopes ───
export const PERMISSION_SCOPES = [
  'FILESYSTEM',
  'TERMINAL',
  'BROWSER',
  'MEMORY',
  'TASK',
  'AGENT',
  'CHECKPOINT',
  'APPROVAL',
  'HTTP',
] as const;
export type PermissionScope = (typeof PERMISSION_SCOPES)[number];

// ─── Memory Types ───
export const MEMORY_TYPES = [
  'SHORT_TERM',
  'EPISODIC',
  'SEMANTIC',
  'USER',
  'AGENT',
] as const;
export type MemoryType = (typeof MEMORY_TYPES)[number];

// ─── Approval States ───
export const APPROVAL_STATES = [
  'PENDING',
  'APPROVED',
  'REJECTED',
] as const;
export type ApprovalState = (typeof APPROVAL_STATES)[number];

// ─── Organization Roles ───
export const ORG_ROLES = [
  'admin',
  'operator',
  'viewer',
] as const;
export type OrgRole = (typeof ORG_ROLES)[number];

// ─── Mission Priorities ───
export const MISSION_PRIORITIES = [
  'LOW',
  'NORMAL',
  'HIGH',
  'CRITICAL',
] as const;
export type MissionPriority = (typeof MISSION_PRIORITIES)[number];

// ─── Failure Classes ───
export const FAILURE_CLASSES = [
  'TRANSIENT',
  'VALIDATION',
  'AUTHORIZATION',
  'RESOURCE',
  'ENVIRONMENT',
  'LOGIC',
  'UNKNOWN',
] as const;
export type FailureClass = (typeof FAILURE_CLASSES)[number];

// ─── Action Types ───
export const ACTION_TYPES = [
  'TOOL_CALL',
  'CREATE_TASK',
  'WAIT',
  'REQUEST_APPROVAL',
  'REPLAN',
  'COMPLETE',
] as const;
export type ActionType = (typeof ACTION_TYPES)[number];

// ─── Mission Categories ───
export const MISSION_CATEGORIES = [
  'SOFTWARE_ENGINEERING',
  'RESEARCH',
  'DATA_ANALYSIS',
  'WEB_RESEARCH',
  'DOCUMENT_PROCESSING',
  'AUTOMATION',
  'SYSTEM_ADMINISTRATION',
  'CONTENT_GENERATION',
] as const;
export type MissionCategory = (typeof MISSION_CATEGORIES)[number];

// ─── Network Policies ───
export const NETWORK_POLICIES = [
  'NO_NETWORK',
  'ALLOWLIST',
  'OPEN',
] as const;
export type NetworkPolicy = (typeof NETWORK_POLICIES)[number];

// ─── Agent Message Types ───
export const AGENT_MESSAGE_TYPES = [
  'TASK_ASSIGNMENT',
  'TASK_RESULT',
  'STATUS_UPDATE',
  'CONTEXT_SHARE',
  'ERROR_REPORT',
] as const;
export type AgentMessageType = (typeof AGENT_MESSAGE_TYPES)[number];

// ─── Built-in Tool Names ───
export const BUILTIN_TOOLS = [
  'filesystem.read',
  'filesystem.write',
  'filesystem.list',
  'terminal.execute',
  'browser.search',
  'browser.open',
  'browser.extract',
  'http.request',
  'memory.search',
  'memory.store',
  'task.create',
  'task.update',
  'task.complete',
  'agent.spawn',
  'agent.message',
  'checkpoint.create',
  'checkpoint.restore',
  'approval.request',
] as const;
export type BuiltinTool = (typeof BUILTIN_TOOLS)[number];

// ─── SSE Event Types ───
export const SSE_EVENT_TYPES = [
  'step_started',
  'step_completed',
  'tool_executed',
  'task_updated',
  'approval_requested',
  'checkpoint_created',
  'mission_status_changed',
  'agent_status_changed',
  'error',
  'heartbeat',
] as const;
export type SSEEventType = (typeof SSE_EVENT_TYPES)[number];

// ─── API Response ───
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  details?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}
