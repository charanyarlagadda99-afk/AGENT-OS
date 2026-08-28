import type { Agent, Mission, Task, ExecutionStep, Approval, Memory } from '@agentos/shared';

export const getDemoAgents = (): Agent[] => [
  {
    id: 'agent-1',
    organization_id: '00000000-0000-0000-0000-000000000001',
    name: 'Autonomous Software Engineer',
    description: 'Inspects codebases, fixes failing tests, resolves package errors, and prepares applications for production.',
    system_instructions: 'You are an autonomous software agent. Inspect code, run tests, fix bugs, and verify build status.',
    model: 'gemini-2.5-flash',
    temperature: 0.2,
    max_steps: 30,
    max_runtime_seconds: 1800,
    autonomy_level: 'CONFIRMED',
    status: 'RUNNING',
    memory_scope: 'AGENT',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'agent-2',
    organization_id: '00000000-0000-0000-0000-000000000001',
    name: 'Security Auditor Agent',
    description: 'Scans repositories for unvalidated parameters, SQL injection risks, secret leaks, and outdated dependencies.',
    system_instructions: 'Perform security code audits and report vulnerabilities with risk classifications.',
    model: 'gemini-2.5-pro',
    temperature: 0.1,
    max_steps: 20,
    max_runtime_seconds: 1800,
    autonomy_level: 'SUPERVISED',
    status: 'IDLE',
    memory_scope: 'AGENT',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'agent-3',
    organization_id: '00000000-0000-0000-0000-000000000001',
    name: 'DevOps & CI/CD Specialist',
    description: 'Generates Dockerfiles, sets up deployment manifests, configures reverse proxies, and monitors health.',
    system_instructions: 'Manage deployment pipelines and container configurations.',
    model: 'gemini-2.5-flash',
    temperature: 0.2,
    max_steps: 25,
    max_runtime_seconds: 1800,
    autonomy_level: 'AUTONOMOUS',
    status: 'IDLE',
    memory_scope: 'AGENT',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'agent-4',
    organization_id: '00000000-0000-0000-0000-000000000001',
    name: 'Research & Synthesis Worker',
    description: 'Crawls technical documentation, extracts API schemas, and synthesizes architectural reports.',
    system_instructions: 'Conduct research and summarize documentation accurately.',
    model: 'gemini-2.5-flash',
    temperature: 0.3,
    max_steps: 15,
    max_runtime_seconds: 1800,
    autonomy_level: 'CONFIRMED',
    status: 'IDLE',
    memory_scope: 'AGENT',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const getDemoMissions = (): Mission[] => [
  {
    id: 'mission-1',
    organization_id: '00000000-0000-0000-0000-000000000001',
    agent_id: 'agent-1',
    title: 'Make demo-broken-repo production-ready',
    objective: 'Inspect repository at demo/broken-repo, fix missing cors dependency, repair failing vitest assertions, resolve TypeScript type mismatch in users route, and verify with build.',
    description: 'Flagship software engineering mission demonstrating autonomous bug fixing.',
    priority: 'HIGH',
    status: 'RUNNING',
    initial_context: {},
    success_criteria: [
      { type: 'COMMAND', value: 'npm test', description: 'All unit tests pass' },
      { type: 'COMMAND', value: 'npm run build', description: 'TypeScript build succeeds' },
    ],
    failure_conditions: ['Build timeout', 'Unresolvable syntax error'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mission-2',
    organization_id: '00000000-0000-0000-0000-000000000001',
    agent_id: 'agent-2',
    title: 'OWASP Top 10 Security Audit & Vulnerability Scan',
    objective: 'Perform static security review across all API endpoints, check for secret leaks and missing authorization checks.',
    description: 'Automated security scan.',
    priority: 'CRITICAL',
    status: 'QUEUED',
    initial_context: {},
    success_criteria: [],
    failure_conditions: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mission-3',
    organization_id: '00000000-0000-0000-0000-000000000001',
    agent_id: 'agent-1',
    title: 'API Route Refactoring & Type Alignment',
    objective: 'Align Express API routes with shared Zod validation schemas.',
    description: 'API refactoring task.',
    priority: 'NORMAL',
    status: 'COMPLETED',
    initial_context: {},
    success_criteria: [],
    failure_conditions: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const getDemoTasks = (missionId: string): Task[] => [
  {
    id: 'task-1',
    organization_id: '00000000-0000-0000-0000-000000000001',
    mission_id: missionId,
    title: 'Inspect repository architecture & package.json',
    description: 'Read package.json and server.ts to identify missing imports.',
    status: 'COMPLETED',
    priority: 100,
    dependencies: [],
    input: {},
    output: { summary: 'Discovered missing cors package import in server.ts' },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'task-2',
    organization_id: '00000000-0000-0000-0000-000000000001',
    mission_id: missionId,
    title: 'Run initial test suite & record failures',
    description: 'Execute npm test to locate failing assertions.',
    status: 'COMPLETED',
    priority: 90,
    dependencies: ['task-1'],
    input: {},
    output: { summary: 'Vitest reported 2 failing assertions in api.test.ts' },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'task-3',
    organization_id: '00000000-0000-0000-0000-000000000001',
    mission_id: missionId,
    title: 'Install missing cors dependency',
    description: 'Run npm install cors to satisfy server.ts requirements.',
    status: 'COMPLETED',
    priority: 80,
    dependencies: ['task-1'],
    input: {},
    output: { summary: 'Installed cors@^2.8.5 successfully' },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'task-4',
    organization_id: '00000000-0000-0000-0000-000000000001',
    mission_id: missionId,
    title: 'Fix failing test assertions in api.test.ts',
    description: 'Correct name length check and HTTP 201 status assertion in test suite.',
    status: 'RUNNING',
    priority: 70,
    dependencies: ['task-2'],
    input: {},
    output: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'task-5',
    organization_id: '00000000-0000-0000-0000-000000000001',
    mission_id: missionId,
    title: 'Fix TypeScript type mismatch in users.ts',
    description: 'Correct User.name interface definition from number to string.',
    status: 'PENDING',
    priority: 60,
    dependencies: ['task-4'],
    input: {},
    output: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'task-6',
    organization_id: '00000000-0000-0000-0000-000000000001',
    mission_id: missionId,
    title: 'Run full verification & build check',
    description: 'Execute npm test and npm run build to verify zero errors.',
    status: 'PENDING',
    priority: 50,
    dependencies: ['task-5'],
    input: {},
    output: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const getDemoSteps = (runId: string): ExecutionStep[] => [
  {
    id: 'step-1',
    organization_id: '00000000-0000-0000-0000-000000000001',
    agent_run_id: runId,
    step_number: 1,
    step_type: 'PLAN',
    status: 'COMPLETED',
    input_summary: 'Mission objective received',
    output_summary: 'Generated 6-task execution DAG',
    result: {},
    duration_ms: 450,
    created_at: new Date(Date.now() - 600000).toISOString(),
  },
  {
    id: 'step-2',
    organization_id: '00000000-0000-0000-0000-000000000001',
    agent_run_id: runId,
    step_number: 2,
    step_type: 'TOOL_CALL',
    tool_name: 'filesystem.read',
    status: 'COMPLETED',
    input_summary: 'Read demo/broken-repo/package.json',
    output_summary: 'Found express, zod installed. Missing cors dependency.',
    result: {},
    duration_ms: 120,
    created_at: new Date(Date.now() - 500000).toISOString(),
  },
  {
    id: 'step-3',
    organization_id: '00000000-0000-0000-0000-000000000001',
    agent_run_id: runId,
    step_number: 3,
    step_type: 'TOOL_CALL',
    tool_name: 'terminal.execute',
    status: 'COMPLETED',
    input_summary: 'Ran command: npm test',
    output_summary: 'Vitest failure: expected 200 to be 201 in api.test.ts',
    result: {},
    duration_ms: 1800,
    created_at: new Date(Date.now() - 400000).toISOString(),
  },
  {
    id: 'step-4',
    organization_id: '00000000-0000-0000-0000-000000000001',
    agent_run_id: runId,
    step_number: 4,
    step_type: 'APPROVAL_REQUEST',
    tool_name: 'terminal.execute',
    status: 'PENDING',
    input_summary: 'Requesting approval to execute: npm install cors',
    output_summary: 'Awaiting human authorization for package installation',
    result: {},
    duration_ms: 50,
    created_at: new Date(Date.now() - 200000).toISOString(),
  },
  {
    id: 'step-5',
    organization_id: '00000000-0000-0000-0000-000000000001',
    agent_run_id: runId,
    step_number: 5,
    step_type: 'TOOL_CALL',
    tool_name: 'filesystem.write',
    status: 'COMPLETED',
    input_summary: 'Updated src/routes/users.ts: name: string',
    output_summary: 'Fixed TypeScript interface definition',
    result: {},
    duration_ms: 180,
    created_at: new Date(Date.now() - 100000).toISOString(),
  },
  {
    id: 'step-6',
    organization_id: '00000000-0000-0000-0000-000000000001',
    agent_run_id: runId,
    step_number: 6,
    step_type: 'VERIFICATION',
    status: 'RUNNING',
    input_summary: 'Executing verification gates',
    output_summary: 'Checking npm test and npm run build status',
    result: {},
    duration_ms: 320,
    created_at: new Date().toISOString(),
  },
];

export const getDemoApprovals = (): Approval[] => [
  {
    id: 'app-1',
    organization_id: '00000000-0000-0000-0000-000000000001',
    mission_id: 'mission-1',
    agent_run_id: 'run-1',
    action_type: 'terminal.execute',
    action_payload: { command: 'npm install cors' },
    risk_level: 'HIGH',
    status: 'PENDING',
    requested_at: new Date().toISOString(),
  },
];

export const getDemoMemories = (): Memory[] => [
  {
    id: 'mem-1',
    organization_id: '00000000-0000-0000-0000-000000000001',
    memory_type: 'SEMANTIC',
    content: 'Repository demo/broken-repo uses NodeNext ESM resolution with vitest test runner.',
    importance: 85,
    metadata: {},
    created_at: new Date().toISOString(),
  },
  {
    id: 'mem-2',
    organization_id: '00000000-0000-0000-0000-000000000001',
    memory_type: 'EPISODIC',
    content: 'Fixed cors import error by adding cors to package.json dependencies.',
    importance: 90,
    metadata: {},
    created_at: new Date().toISOString(),
  },
];

export const getDemoWorkspaces = (): Record<string, string> => ({
  'src/server.ts': `import express from 'express';
import cors from 'cors';
import { userRouter } from './routes/users.js';
import { taskRouter } from './routes/tasks.js';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

app.use('/api/users', userRouter);
app.use('/api/tasks', taskRouter);

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});
`,
  'src/routes/users.ts': `import { Router } from 'express';
import { z } from 'zod';

const router = Router();

interface User {
  id: number;
  name: string; // Fixed: string instead of number
  email: string;
}

const users: User[] = [];
let nextId = 1;

router.get('/', (_req, res) => {
  res.json({ users });
});

export { router as userRouter };
`,
  'package.json': `{
  "name": "demo-broken-app",
  "version": "1.0.0",
  "type": "module",
  "dependencies": {
    "cors": "^2.8.5",
    "express": "^4.21.0",
    "zod": "^3.24.0"
  }
}
`,
});

export const getDemoAnalytics = () => ({
  totalAgents: 4,
  activeAgents: 1,
  totalMissions: 3,
  completedMissions: 1,
  failedMissions: 0,
  runningMissions: 1,
  pendingApprovals: 1,
  successRate: 98.4,
  avgRuntime: 142,
  totalToolCalls: 48,
});
