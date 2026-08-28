import { z } from 'zod';
import {
  AGENT_STATES,
  MISSION_STATES,
  TASK_STATES,
  RUN_STATES,
  STEP_TYPES,
  AUTONOMY_LEVELS,
  RISK_LEVELS,
  SIDE_EFFECT_TYPES,
  PERMISSION_SCOPES,
  MEMORY_TYPES,
  APPROVAL_STATES,
  ORG_ROLES,
  MISSION_PRIORITIES,
  ACTION_TYPES,
} from '../constants/index.js';

// ─── Organization ───
export const OrganizationSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  slug: z.string().min(1),
  created_at: z.string(),
  updated_at: z.string(),
});
export type Organization = z.infer<typeof OrganizationSchema>;

export const OrgMemberSchema = z.object({
  id: z.string().uuid(),
  organization_id: z.string().uuid(),
  user_id: z.string().uuid(),
  role: z.enum(ORG_ROLES),
  created_at: z.string(),
});
export type OrgMember = z.infer<typeof OrgMemberSchema>;

// ─── Agent ───
export const AgentSchema = z.object({
  id: z.string().uuid(),
  organization_id: z.string().uuid(),
  name: z.string().min(1).max(100),
  description: z.string().nullable().optional(),
  system_instructions: z.string().min(1),
  model: z.string().min(1),
  temperature: z.number().min(0).max(2).default(0.2),
  max_steps: z.number().int().min(1).max(200).default(20),
  max_runtime_seconds: z.number().int().min(60).max(86400).default(1800),
  autonomy_level: z.enum(AUTONOMY_LEVELS).default('CONFIRMED'),
  status: z.enum(AGENT_STATES).default('IDLE'),
  memory_scope: z.string().default('AGENT'),
  budget_limit: z.number().nullable().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});
export type Agent = z.infer<typeof AgentSchema>;

export const CreateAgentSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  system_instructions: z.string().min(1).default(
    'You are an autonomous software agent running inside AgentOS. Complete missions safely, accurately, efficiently, and verifiably.'
  ),
  model: z.string().min(1).default('gemini-2.5-flash'),
  temperature: z.number().min(0).max(2).default(0.2),
  max_steps: z.number().int().min(1).max(200).default(20),
  max_runtime_seconds: z.number().int().min(60).max(86400).default(1800),
  autonomy_level: z.enum(AUTONOMY_LEVELS).default('CONFIRMED'),
  memory_scope: z.string().default('AGENT'),
  budget_limit: z.number().nullable().optional(),
  tool_ids: z.array(z.string().uuid()).optional(),
});
export type CreateAgent = z.infer<typeof CreateAgentSchema>;

export const UpdateAgentSchema = CreateAgentSchema.partial();
export type UpdateAgent = z.infer<typeof UpdateAgentSchema>;

// ─── Mission ───
export const SuccessCriterionSchema = z.object({
  type: z.enum(['COMMAND', 'FILE_EXISTS', 'CONTAINS', 'CUSTOM']),
  value: z.string(),
  expectedExitCode: z.number().optional(),
  description: z.string().optional(),
});
export type SuccessCriterion = z.infer<typeof SuccessCriterionSchema>;

export const MissionSchema = z.object({
  id: z.string().uuid(),
  organization_id: z.string().uuid(),
  agent_id: z.string().uuid(),
  title: z.string().min(1).max(200),
  objective: z.string().min(1),
  description: z.string().nullable().optional(),
  priority: z.enum(MISSION_PRIORITIES).default('NORMAL'),
  status: z.enum(MISSION_STATES).default('QUEUED'),
  initial_context: z.record(z.unknown()).default({}),
  success_criteria: z.array(SuccessCriterionSchema).default([]),
  failure_conditions: z.array(z.string()).default([]),
  deadline: z.string().nullable().optional(),
  started_at: z.string().nullable().optional(),
  completed_at: z.string().nullable().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});
export type Mission = z.infer<typeof MissionSchema>;

export const CreateMissionSchema = z.object({
  agent_id: z.string().uuid(),
  title: z.string().min(1).max(200),
  objective: z.string().min(1),
  description: z.string().optional(),
  priority: z.enum(MISSION_PRIORITIES).default('NORMAL'),
  initial_context: z.record(z.unknown()).default({}),
  success_criteria: z.array(SuccessCriterionSchema).default([]),
  failure_conditions: z.array(z.string()).default([]),
  deadline: z.string().optional(),
});
export type CreateMission = z.infer<typeof CreateMissionSchema>;

// ─── Task ───
export const TaskSchema = z.object({
  id: z.string().uuid(),
  organization_id: z.string().uuid(),
  mission_id: z.string().uuid(),
  parent_task_id: z.string().uuid().nullable().optional(),
  title: z.string().min(1),
  description: z.string().nullable().optional(),
  status: z.enum(TASK_STATES).default('PENDING'),
  priority: z.number().int().default(100),
  dependencies: z.array(z.string()).default([]),
  assigned_agent_id: z.string().uuid().nullable().optional(),
  input: z.record(z.unknown()).default({}),
  output: z.record(z.unknown()).default({}),
  error: z.record(z.unknown()).nullable().optional(),
  created_at: z.string(),
  started_at: z.string().nullable().optional(),
  completed_at: z.string().nullable().optional(),
  updated_at: z.string(),
});
export type Task = z.infer<typeof TaskSchema>;

export const CreateTaskSchema = z.object({
  mission_id: z.string().uuid(),
  parent_task_id: z.string().uuid().optional(),
  title: z.string().min(1),
  description: z.string().optional(),
  priority: z.number().int().default(100),
  dependencies: z.array(z.string()).default([]),
  assigned_agent_id: z.string().uuid().optional(),
  input: z.record(z.unknown()).default({}),
});
export type CreateTask = z.infer<typeof CreateTaskSchema>;

// ─── Agent Run ───
export const AgentRunSchema = z.object({
  id: z.string().uuid(),
  organization_id: z.string().uuid(),
  agent_id: z.string().uuid(),
  mission_id: z.string().uuid().nullable().optional(),
  parent_run_id: z.string().uuid().nullable().optional(),
  status: z.enum(RUN_STATES).default('RUNNING'),
  step_count: z.number().int().default(0),
  started_at: z.string(),
  completed_at: z.string().nullable().optional(),
  error: z.record(z.unknown()).nullable().optional(),
  token_usage: z.record(z.unknown()).default({}),
  metadata: z.record(z.unknown()).default({}),
});
export type AgentRun = z.infer<typeof AgentRunSchema>;

// ─── Execution Step ───
export const ExecutionStepSchema = z.object({
  id: z.string().uuid(),
  organization_id: z.string().uuid(),
  agent_run_id: z.string().uuid(),
  task_id: z.string().uuid().nullable().optional(),
  step_number: z.number().int(),
  step_type: z.enum(STEP_TYPES),
  tool_name: z.string().nullable().optional(),
  status: z.string(),
  input_summary: z.string().nullable().optional(),
  output_summary: z.string().nullable().optional(),
  result: z.record(z.unknown()).default({}),
  duration_ms: z.number().int().nullable().optional(),
  created_at: z.string(),
});
export type ExecutionStep = z.infer<typeof ExecutionStepSchema>;

// ─── Tool ───
export const ToolSchema = z.object({
  id: z.string().uuid(),
  organization_id: z.string().uuid().nullable().optional(),
  name: z.string().min(1),
  description: z.string().min(1),
  input_schema: z.record(z.unknown()),
  output_schema: z.record(z.unknown()),
  permission_scope: z.enum(PERMISSION_SCOPES),
  risk_level: z.enum(RISK_LEVELS),
  side_effect_type: z.enum(SIDE_EFFECT_TYPES),
  enabled: z.boolean().default(true),
  created_at: z.string(),
});
export type Tool = z.infer<typeof ToolSchema>;

export const AgentToolSchema = z.object({
  id: z.string().uuid(),
  agent_id: z.string().uuid(),
  tool_id: z.string().uuid(),
  enabled: z.boolean().default(true),
  constraints: z.record(z.unknown()).default({}),
});
export type AgentTool = z.infer<typeof AgentToolSchema>;

// ─── Memory ───
export const MemorySchema = z.object({
  id: z.string().uuid(),
  organization_id: z.string().uuid(),
  agent_id: z.string().uuid().nullable().optional(),
  mission_id: z.string().uuid().nullable().optional(),
  memory_type: z.enum(MEMORY_TYPES),
  content: z.string(),
  metadata: z.record(z.unknown()).default({}),
  importance: z.number().int().min(0).max(100).default(50),
  created_at: z.string(),
  last_accessed_at: z.string().nullable().optional(),
});
export type Memory = z.infer<typeof MemorySchema>;

export const CreateMemorySchema = z.object({
  agent_id: z.string().uuid().optional(),
  mission_id: z.string().uuid().optional(),
  memory_type: z.enum(MEMORY_TYPES),
  content: z.string().min(1),
  metadata: z.record(z.unknown()).default({}),
  importance: z.number().int().min(0).max(100).default(50),
});
export type CreateMemory = z.infer<typeof CreateMemorySchema>;

// ─── Workspace ───
export const WorkspaceSchema = z.object({
  id: z.string().uuid(),
  organization_id: z.string().uuid(),
  agent_id: z.string().uuid().nullable().optional(),
  name: z.string().min(1),
  root_path: z.string().min(1),
  created_at: z.string(),
});
export type Workspace = z.infer<typeof WorkspaceSchema>;

// ─── Checkpoint ───
export const CheckpointSchema = z.object({
  id: z.string().uuid(),
  organization_id: z.string().uuid(),
  agent_id: z.string().uuid(),
  mission_id: z.string().uuid(),
  label: z.string().min(1),
  state: z.record(z.unknown()),
  workspace_reference: z.string().nullable().optional(),
  created_at: z.string(),
});
export type Checkpoint = z.infer<typeof CheckpointSchema>;

// ─── Approval ───
export const ApprovalSchema = z.object({
  id: z.string().uuid(),
  organization_id: z.string().uuid(),
  mission_id: z.string().uuid(),
  agent_run_id: z.string().uuid().nullable().optional(),
  action_type: z.string(),
  action_payload: z.record(z.unknown()).default({}),
  risk_level: z.enum(RISK_LEVELS),
  status: z.enum(APPROVAL_STATES).default('PENDING'),
  requested_at: z.string(),
  decided_at: z.string().nullable().optional(),
  decided_by: z.string().uuid().nullable().optional(),
  decision_reason: z.string().nullable().optional(),
});
export type Approval = z.infer<typeof ApprovalSchema>;

// ─── Tool Execution ───
export const ToolExecutionSchema = z.object({
  id: z.string().uuid(),
  organization_id: z.string().uuid(),
  agent_run_id: z.string().uuid(),
  tool_id: z.string().uuid().nullable().optional(),
  idempotency_key: z.string(),
  status: z.string(),
  input: z.record(z.unknown()).default({}),
  output: z.record(z.unknown()).default({}),
  error: z.record(z.unknown()).nullable().optional(),
  started_at: z.string(),
  completed_at: z.string().nullable().optional(),
});
export type ToolExecution = z.infer<typeof ToolExecutionSchema>;

// ─── Audit Log ───
export const AuditLogSchema = z.object({
  id: z.string().uuid(),
  organization_id: z.string().uuid(),
  actor_type: z.string(),
  actor_id: z.string().nullable().optional(),
  event_type: z.string(),
  entity_type: z.string().nullable().optional(),
  entity_id: z.string().uuid().nullable().optional(),
  metadata: z.record(z.unknown()).default({}),
  created_at: z.string(),
});
export type AuditLog = z.infer<typeof AuditLogSchema>;

// ─── AI Response Schemas ───

export const PlanTaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  dependencies: z.array(z.string()),
  priority: z.number().int(),
  successCriteria: z.array(z.string()),
});
export type PlanTask = z.infer<typeof PlanTaskSchema>;

export const MissionPlanSchema = z.object({
  goal: z.string(),
  tasks: z.array(PlanTaskSchema),
});
export type MissionPlan = z.infer<typeof MissionPlanSchema>;

export const NextActionSchema = z.object({
  actionType: z.enum(ACTION_TYPES),
  toolName: z.string().nullable().optional(),
  arguments: z.record(z.unknown()).nullable().optional(),
  taskId: z.string().nullable().optional(),
  explanation: z.string(),
});
export type NextAction = z.infer<typeof NextActionSchema>;

export const VerificationResultSchema = z.object({
  verified: z.boolean(),
  criteria: z.array(
    z.object({
      criterion: z.string(),
      passed: z.boolean(),
      evidence: z.string(),
    })
  ),
  summary: z.string(),
});
export type VerificationResult = z.infer<typeof VerificationResultSchema>;

export const ApprovalRequestSchema = z.object({
  action: z.string(),
  reason: z.string(),
  riskLevel: z.enum(RISK_LEVELS),
  expectedImpact: z.string(),
  rollbackAvailable: z.boolean(),
});
export type ApprovalRequest = z.infer<typeof ApprovalRequestSchema>;

export const ReplanDecisionSchema = z.object({
  decision: z.enum(['continue', 'retry', 'modify', 'create_task', 'rollback', 'escalate', 'complete']),
  explanation: z.string(),
  newTasks: z.array(PlanTaskSchema).optional(),
  modifiedTaskIds: z.array(z.string()).optional(),
});
export type ReplanDecision = z.infer<typeof ReplanDecisionSchema>;

export const MemoryExtractionSchema = z.object({
  memories: z.array(
    z.object({
      type: z.enum(MEMORY_TYPES),
      content: z.string(),
      importance: z.number().int().min(0).max(100),
    })
  ),
});
export type MemoryExtraction = z.infer<typeof MemoryExtractionSchema>;

// ─── Analytics ───
export const AnalyticsOverviewSchema = z.object({
  totalAgents: z.number(),
  activeAgents: z.number(),
  totalMissions: z.number(),
  completedMissions: z.number(),
  failedMissions: z.number(),
  runningMissions: z.number(),
  pendingApprovals: z.number(),
  successRate: z.number(),
  avgRuntime: z.number(),
  totalToolCalls: z.number(),
});
export type AnalyticsOverview = z.infer<typeof AnalyticsOverviewSchema>;
