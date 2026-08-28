-- organizations
create table organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- organization_members  
create table organization_members (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('admin','operator','viewer')),
  created_at timestamptz not null default now(),
  unique (organization_id,user_id)
);

-- agents
create table agents (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  name text not null,
  description text,
  system_instructions text not null,
  model text not null,
  temperature numeric(3,2) default 0.2,
  max_steps integer not null default 20,
  max_runtime_seconds integer not null default 1800,
  autonomy_level text not null default 'CONFIRMED',
  status text not null default 'IDLE',
  memory_scope text not null default 'AGENT',
  budget_limit numeric(12,4),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- missions
create table missions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  agent_id uuid not null references agents(id) on delete cascade,
  title text not null,
  objective text not null,
  description text,
  priority text not null default 'NORMAL',
  status text not null default 'QUEUED',
  initial_context jsonb not null default '{}',
  success_criteria jsonb not null default '[]',
  failure_conditions jsonb not null default '[]',
  deadline timestamptz,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- tasks
create table tasks (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  mission_id uuid not null references missions(id) on delete cascade,
  parent_task_id uuid references tasks(id) on delete cascade,
  title text not null,
  description text,
  status text not null default 'PENDING',
  priority integer not null default 100,
  dependencies jsonb not null default '[]',
  assigned_agent_id uuid references agents(id) on delete set null,
  input jsonb not null default '{}',
  output jsonb not null default '{}',
  error jsonb,
  created_at timestamptz not null default now(),
  started_at timestamptz,
  completed_at timestamptz,
  updated_at timestamptz not null default now()
);

-- agent_runs
create table agent_runs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  agent_id uuid not null references agents(id) on delete cascade,
  mission_id uuid references missions(id) on delete cascade,
  parent_run_id uuid references agent_runs(id) on delete set null,
  status text not null default 'RUNNING',
  step_count integer not null default 0,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  error jsonb,
  token_usage jsonb not null default '{}',
  metadata jsonb not null default '{}'
);

-- execution_steps
create table execution_steps (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  agent_run_id uuid not null references agent_runs(id) on delete cascade,
  task_id uuid references tasks(id) on delete set null,
  step_number integer not null,
  step_type text not null,
  tool_name text,
  status text not null,
  input_summary text,
  output_summary text,
  result jsonb not null default '{}',
  duration_ms integer,
  created_at timestamptz not null default now()
);

-- tools
create table tools (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references organizations(id) on delete cascade,
  name text not null,
  description text not null,
  input_schema jsonb not null,
  output_schema jsonb not null,
  permission_scope text not null,
  risk_level text not null,
  side_effect_type text not null,
  enabled boolean not null default true,
  created_at timestamptz not null default now()
);

-- agent_tools
create table agent_tools (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid not null references agents(id) on delete cascade,
  tool_id uuid not null references tools(id) on delete cascade,
  enabled boolean not null default true,
  constraints jsonb not null default '{}',
  unique(agent_id,tool_id)
);

-- memories
create table memories (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  agent_id uuid references agents(id) on delete cascade,
  mission_id uuid references missions(id) on delete cascade,
  memory_type text not null,
  content text not null,
  metadata jsonb not null default '{}',
  importance integer not null default 50,
  created_at timestamptz not null default now(),
  last_accessed_at timestamptz
);

-- workspaces
create table workspaces (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  agent_id uuid references agents(id) on delete cascade,
  name text not null,
  root_path text not null,
  created_at timestamptz not null default now()
);

-- checkpoints
create table checkpoints (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  agent_id uuid not null references agents(id) on delete cascade,
  mission_id uuid not null references missions(id) on delete cascade,
  label text not null,
  state jsonb not null,
  workspace_reference text,
  created_at timestamptz not null default now()
);

-- approvals
create table approvals (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  mission_id uuid not null references missions(id) on delete cascade,
  agent_run_id uuid references agent_runs(id) on delete set null,
  action_type text not null,
  action_payload jsonb not null default '{}',
  risk_level text not null,
  status text not null default 'PENDING',
  requested_at timestamptz not null default now(),
  decided_at timestamptz,
  decided_by uuid references auth.users(id),
  decision_reason text
);

-- tool_executions
create table tool_executions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  agent_run_id uuid not null references agent_runs(id) on delete cascade,
  tool_id uuid references tools(id) on delete set null,
  idempotency_key text not null,
  status text not null,
  input jsonb not null default '{}',
  output jsonb not null default '{}',
  error jsonb,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  unique(organization_id,idempotency_key)
);

-- audit_logs
create table audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  actor_type text not null,
  actor_id text,
  event_type text not null,
  entity_type text,
  entity_id uuid,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);
