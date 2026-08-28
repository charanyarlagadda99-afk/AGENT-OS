-- organization_members
CREATE INDEX idx_organization_members_org_id ON organization_members(organization_id);
CREATE INDEX idx_organization_members_user_id ON organization_members(user_id);

-- agents
CREATE INDEX idx_agents_org_id ON agents(organization_id);
CREATE INDEX idx_agents_status ON agents(status);
CREATE INDEX idx_agents_created_at ON agents(created_at);

-- missions
CREATE INDEX idx_missions_org_id ON missions(organization_id);
CREATE INDEX idx_missions_agent_id ON missions(agent_id);
CREATE INDEX idx_missions_status ON missions(status);
CREATE INDEX idx_missions_created_at ON missions(created_at);

-- tasks
CREATE INDEX idx_tasks_org_id ON tasks(organization_id);
CREATE INDEX idx_tasks_mission_id ON tasks(mission_id);
CREATE INDEX idx_tasks_parent_task_id ON tasks(parent_task_id);
CREATE INDEX idx_tasks_assigned_agent_id ON tasks(assigned_agent_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_created_at ON tasks(created_at);

-- agent_runs
CREATE INDEX idx_agent_runs_org_id ON agent_runs(organization_id);
CREATE INDEX idx_agent_runs_agent_id ON agent_runs(agent_id);
CREATE INDEX idx_agent_runs_mission_id ON agent_runs(mission_id);
CREATE INDEX idx_agent_runs_status ON agent_runs(status);

-- execution_steps
CREATE INDEX idx_execution_steps_org_id ON execution_steps(organization_id);
CREATE INDEX idx_execution_steps_agent_run_id ON execution_steps(agent_run_id);
CREATE INDEX idx_execution_steps_task_id ON execution_steps(task_id);
CREATE INDEX idx_execution_steps_created_at ON execution_steps(created_at);

-- tools
CREATE INDEX idx_tools_org_id ON tools(organization_id);

-- agent_tools
CREATE INDEX idx_agent_tools_agent_id ON agent_tools(agent_id);
CREATE INDEX idx_agent_tools_tool_id ON agent_tools(tool_id);

-- memories
CREATE INDEX idx_memories_org_id ON memories(organization_id);
CREATE INDEX idx_memories_agent_id ON memories(agent_id);
CREATE INDEX idx_memories_mission_id ON memories(mission_id);
CREATE INDEX idx_memories_created_at ON memories(created_at);

-- workspaces
CREATE INDEX idx_workspaces_org_id ON workspaces(organization_id);
CREATE INDEX idx_workspaces_agent_id ON workspaces(agent_id);

-- checkpoints
CREATE INDEX idx_checkpoints_org_id ON checkpoints(organization_id);
CREATE INDEX idx_checkpoints_agent_id ON checkpoints(agent_id);
CREATE INDEX idx_checkpoints_mission_id ON checkpoints(mission_id);

-- approvals
CREATE INDEX idx_approvals_org_id ON approvals(organization_id);
CREATE INDEX idx_approvals_mission_id ON approvals(mission_id);
CREATE INDEX idx_approvals_agent_run_id ON approvals(agent_run_id);
CREATE INDEX idx_approvals_status ON approvals(status);

-- tool_executions
CREATE INDEX idx_tool_executions_org_id ON tool_executions(organization_id);
CREATE INDEX idx_tool_executions_agent_run_id ON tool_executions(agent_run_id);
CREATE INDEX idx_tool_executions_tool_id ON tool_executions(tool_id);
CREATE INDEX idx_tool_executions_status ON tool_executions(status);

-- audit_logs
CREATE INDEX idx_audit_logs_org_id ON audit_logs(organization_id);
CREATE INDEX idx_audit_logs_actor_id ON audit_logs(actor_id);
CREATE INDEX idx_audit_logs_entity_id ON audit_logs(entity_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
