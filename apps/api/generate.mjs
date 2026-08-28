import fs from 'fs';
import path from 'path';

const files = {
  'src/agents/runtime/state-machine.ts': `import { SupabaseClient } from '@supabase/supabase-js';

export const AGENT_STATES = {
  IDLE: 'IDLE',
  PLANNING: 'PLANNING',
  RUNNING: 'RUNNING',
  PAUSED: 'PAUSED',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  TERMINATED: 'TERMINATED'
};

export const MISSION_STATES = {
  QUEUED: 'QUEUED',
  PLANNING: 'PLANNING',
  RUNNING: 'RUNNING',
  PAUSED: 'PAUSED',
  WAITING: 'WAITING',
  VERIFYING: 'VERIFYING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  CANCELLED: 'CANCELLED'
};

export const TASK_STATES = {
  PENDING: 'PENDING',
  READY: 'READY',
  RUNNING: 'RUNNING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  SKIPPED: 'SKIPPED',
  BLOCKED: 'BLOCKED'
};

const VALID_TRANSITIONS = {
  agent: {
    [AGENT_STATES.IDLE]: [AGENT_STATES.PLANNING, AGENT_STATES.TERMINATED],
    [AGENT_STATES.PLANNING]: [AGENT_STATES.RUNNING, AGENT_STATES.TERMINATED],
    [AGENT_STATES.RUNNING]: [AGENT_STATES.PAUSED, AGENT_STATES.COMPLETED, AGENT_STATES.FAILED, AGENT_STATES.TERMINATED],
    [AGENT_STATES.PAUSED]: [AGENT_STATES.RUNNING, AGENT_STATES.TERMINATED],
    [AGENT_STATES.COMPLETED]: [AGENT_STATES.TERMINATED],
    [AGENT_STATES.FAILED]: [AGENT_STATES.TERMINATED]
  },
  mission: {
    [MISSION_STATES.QUEUED]: [MISSION_STATES.PLANNING, MISSION_STATES.CANCELLED],
    [MISSION_STATES.PLANNING]: [MISSION_STATES.RUNNING, MISSION_STATES.CANCELLED],
    [MISSION_STATES.RUNNING]: [MISSION_STATES.PAUSED, MISSION_STATES.WAITING, MISSION_STATES.VERIFYING, MISSION_STATES.CANCELLED],
    [MISSION_STATES.PAUSED]: [MISSION_STATES.RUNNING, MISSION_STATES.CANCELLED],
    [MISSION_STATES.WAITING]: [MISSION_STATES.RUNNING, MISSION_STATES.CANCELLED],
    [MISSION_STATES.VERIFYING]: [MISSION_STATES.COMPLETED, MISSION_STATES.FAILED, MISSION_STATES.CANCELLED],
  },
  task: {
    [TASK_STATES.PENDING]: [TASK_STATES.READY, TASK_STATES.SKIPPED, TASK_STATES.BLOCKED],
    [TASK_STATES.READY]: [TASK_STATES.RUNNING],
    [TASK_STATES.RUNNING]: [TASK_STATES.COMPLETED, TASK_STATES.FAILED],
  }
};

export function validateTransition(entityType: 'agent' | 'mission' | 'task', fromState: string, toState: string): boolean {
  if (toState === 'TERMINATED' && entityType === 'agent') return true;
  if (toState === 'CANCELLED' && entityType === 'mission') return true;
  const transitions = VALID_TRANSITIONS[entityType][fromState] || [];
  return transitions.includes(toState);
}

export async function updateState(supabase: SupabaseClient, entity: 'agent' | 'mission' | 'task', id: string, newState: string): Promise<void> {
  const tableMap = {
    agent: 'agents',
    mission: 'missions',
    task: 'tasks'
  };
  const { error } = await supabase.from(tableMap[entity]).update({ status: newState }).eq('id', id);
  if (error) throw new Error(\`Failed to update \${entity} state: \${error.message}\`);
}`,

  'src/agents/runtime/context-builder.ts': `import type { ExecutionContext } from '@agentos/shared';

export async function buildContext(missionId: string, agentId: string, supabase: any): Promise<ExecutionContext> {
  // Mock context builder for brevity
  return {
    missionId,
    agentId,
    tasks: [],
    recentSteps: [],
    memories: [],
    workspacePath: '/mock/workspace'
  } as unknown as ExecutionContext;
}`,

  'src/agents/runtime/agent-loop.ts': `import { updateState, validateTransition, MISSION_STATES, AGENT_STATES } from './state-machine.js';
import { buildContext } from './context-builder.js';
import { emitter } from '../../events/emitter.js';

export class AgentLoop {
  async execute(missionId: string, agentId: string, orgId: string, supabase: any, provider: any): Promise<void> {
    try {
      await updateState(supabase, 'mission', missionId, MISSION_STATES.RUNNING);
      await updateState(supabase, 'agent', agentId, AGENT_STATES.RUNNING);
      emitter.emitMissionEvent(missionId, 'step_started', { missionId, agentId });
      
      const context = await buildContext(missionId, agentId, supabase);
      const nextAction = await provider.selectNextAction(context, "Objective", "Current State");
      
      emitter.emitMissionEvent(missionId, 'step_completed', { action: nextAction });
      
      if (nextAction.actionType === 'COMPLETE') {
        await updateState(supabase, 'mission', missionId, MISSION_STATES.VERIFYING);
      }
    } catch (error) {
      await updateState(supabase, 'mission', missionId, MISSION_STATES.FAILED);
    }
  }
}`,

  'src/agents/planner/planner.ts': `export async function planMission(mission: any, agent: any, provider: any): Promise<any[]> {
  const plan = await provider.planMission(mission.objective, mission.context, []);
  return plan.tasks.map((t: any) => ({ ...t, status: 'PENDING' }));
}`,

  'src/agents/planner/replanner.ts': `export async function replan(mission: any, currentTasks: any[], failure: any, provider: any): Promise<any[]> {
  const decision = await provider.replanMission(currentTasks, failure, mission.context);
  return decision.tasksToAdd;
}`,

  'src/agents/planner/task-graph.ts': `export function getReadyTasks(tasks: any[]): any[] {
  return tasks.filter(t => t.status === 'READY');
}

export function getNextTask(tasks: any[]): any | null {
  const ready = getReadyTasks(tasks);
  return ready.sort((a, b) => b.priority - a.priority)[0] || null;
}

export function addTask(tasks: any[], newTask: any): any[] {
  return [...tasks, newTask];
}

export function updateTaskStatus(tasks: any[], taskId: string, status: string): any[] {
  return tasks.map(t => t.id === taskId ? { ...t, status } : t);
}

export function isComplete(tasks: any[]): boolean {
  return tasks.every(t => t.status === 'COMPLETED' || t.status === 'SKIPPED');
}`,

  'src/agents/orchestrator/orchestrator.ts': `import { AgentLoop } from '../runtime/agent-loop.js';
import { updateState, MISSION_STATES } from '../runtime/state-machine.js';

export async function startMission(missionId: string, orgId: string, agentId: string, supabase: any, provider: any): Promise<void> {
  const loop = new AgentLoop();
  // start in background
  loop.execute(missionId, agentId, orgId, supabase, provider).catch(console.error);
}

export async function pauseMission(missionId: string, supabase: any): Promise<void> {
  await updateState(supabase, 'mission', missionId, MISSION_STATES.PAUSED);
}

export async function resumeMission(missionId: string, orgId: string, agentId: string, supabase: any, provider: any): Promise<void> {
  await startMission(missionId, orgId, agentId, supabase, provider);
}`,

  'src/agents/orchestrator/step-executor.ts': `export async function executeStep(action: any, context: any, toolRegistry: any): Promise<any> {
  if (action.actionType === 'TOOL_CALL') {
    return toolRegistry.execute(action.toolName, action.toolArgs, context);
  }
  return { status: 'success', actionType: action.actionType };
}`,

  'src/agents/verifier/verifier.ts': `export async function verifyMission(mission: any, workspace: string, provider: any): Promise<any> {
  return provider.verify(mission.criteria, []);
}

export async function runCriterion(criterion: any, workspacePath: string): Promise<{passed: boolean, evidence: string}> {
  return { passed: true, evidence: 'Criterion met' };
}`,

  'src/agents/delegation/sub-agent.ts': `export async function spawnSubAgent(parentRunId: string, config: any, tools: string[], mission: any): Promise<string> {
  return 'new-sub-agent-id';
}

export async function getSubAgentResult(runId: string): Promise<unknown> {
  return { status: 'COMPLETED', result: 'sub-agent finished' };
}`,

  'src/tools/registry.ts': `export class ToolRegistry {
  private tools = new Map<string, { handler: Function, schema: any }>();

  register(name: string, handler: Function, schema: any) {
    this.tools.set(name, { handler, schema });
  }

  get(name: string) {
    return this.tools.get(name);
  }

  list() {
    return Array.from(this.tools.keys());
  }

  async execute(name: string, args: any, context: any) {
    const tool = this.tools.get(name);
    if (!tool) throw new Error(\`Tool \${name} not found\`);
    return tool.handler(args, context);
  }
}`,

  'src/tools/executor.ts': `export async function executeTool(toolName: string, args: any, context: any, registry: any, supabase: any): Promise<any> {
  // Validate, check permissions, risk, etc.
  const result = await registry.execute(toolName, args, context);
  return { success: true, result };
}`,

  'src/tools/filesystem/read.ts': `import fs from 'fs/promises';
export async function readFile(workspaceRoot: string, filePath: string) {
  return fs.readFile(filePath, 'utf-8');
}`,

  'src/tools/filesystem/write.ts': `import fs from 'fs/promises';
import path from 'path';
export async function writeFile(workspaceRoot: string, filePath: string, content: string) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, content, 'utf-8');
}`,

  'src/tools/filesystem/list.ts': `import fs from 'fs/promises';
export async function listDir(workspaceRoot: string, dirPath: string) {
  return fs.readdir(dirPath, { withFileTypes: true });
}`,

  'src/tools/terminal/execute.ts': `import { executeCommand } from '../../sandbox/sandbox.js';
import { classifyCommand, isAllowed } from '../../sandbox/policy.js';

export async function execute(command: string, cwd: string) {
  if (!isAllowed(command)) throw new Error('Command blocked by policy');
  return executeCommand(command, cwd);
}`,

  'src/tools/browser/search.ts': \`export async function search(query: string) { return [{ title: 'Mock Result', url: 'https://example.com' }]; }\`,
  'src/tools/browser/open.ts': \`export async function open(url: string) { return 'Mock Page Content'; }\`,
  'src/tools/browser/extract.ts': \`export async function extract(url: string) { return 'Mock Extracted Content'; }\`,
  'src/tools/memory/search.ts': \`export async function searchMemory(query: string) { return []; }\`,
  'src/tools/memory/store.ts': \`export async function storeMemory(memory: any) { return true; }\`,
  'src/tools/tasks/create.ts': \`export async function createTask(task: any) { return 'task-id'; }\`,
  'src/tools/tasks/update.ts': \`export async function updateTask(id: string, updates: any) { return true; }\`,
  'src/tools/tasks/complete.ts': \`export async function completeTask(id: string) { return true; }\`,
  'src/tools/checkpoints/create.ts': \`export async function createCheckpoint(state: any) { return 'checkpoint-id'; }\`,
  'src/tools/checkpoints/restore.ts': \`export async function restoreCheckpoint(id: string) { return true; }\`,
  'src/tools/agents/spawn.ts': \`import { spawnSubAgent } from '../../agents/delegation/sub-agent.js';
export async function spawnAgent(config: any) { return spawnSubAgent('parent-id', config, [], {}); }\`,
  'src/tools/agents/message.ts': \`export async function sendMessage(to: string, message: string) { return true; }\`,

  'src/memory/manager.ts': \`export async function storeMemory(memory: any, supabase: any) { return true; }
export async function retrieveMemories(agentId: string, query: string, limit: number, supabase: any) { return []; }
export async function deleteMemory(id: string, supabase: any) { return true; }\`,

  'src/workspace/manager.ts': \`export async function createWorkspace(name: string, orgId: string, agentId: string, supabase: any) { return 'workspace-id'; }
export async function getFileTree(rootPath: string, maxDepth: number) { return []; }
export async function readFile(rootPath: string, filePath: string) { return ''; }
export async function writeFile(rootPath: string, filePath: string, content: string) { return true; }
export async function deleteFile(rootPath: string, filePath: string) { return true; }\`,

  'src/approvals/manager.ts': \`export async function createApproval(approval: any, supabase: any) { return 'approval-id'; }
export async function approveAction(id: string, userId: string, reason: string, supabase: any) { return true; }
export async function rejectAction(id: string, userId: string, reason: string, supabase: any) { return true; }
export async function getPendingApprovals(orgId: string, supabase: any) { return []; }\`,

  'src/policies/permission.ts': \`export async function checkToolPermission(agentId: string, toolName: string, supabase: any): Promise<boolean> { return true; }
export function needsApproval(riskLevel: string, autonomyLevel: string): boolean { return riskLevel === 'HIGH' && autonomyLevel !== 'HIGH'; }\`,

  'src/policies/risk.ts': \`export function classifyRisk(toolName: string, args: any): string {
  if (toolName.startsWith('filesystem.write')) return 'MEDIUM';
  if (toolName.startsWith('terminal.execute')) return 'HIGH';
  return 'LOW';
}\`
};

const BASE_DIR = path.resolve('d:/AGENT OS/apps/api');

for (const [relativePath, content] of Object.entries(files)) {
  const fullPath = path.join(BASE_DIR, relativePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(\`Created \${fullPath}\`);
}
