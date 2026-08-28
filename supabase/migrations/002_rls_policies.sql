-- Helper functions
CREATE OR REPLACE FUNCTION public.is_org_member(target_org_id uuid)
RETURNS boolean
LANGUAGE sql SECURITY DEFINER SET search_path = public STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM organization_members
    WHERE organization_id = target_org_id
    AND user_id = (SELECT auth.uid())
  );
$$;

CREATE OR REPLACE FUNCTION public.get_org_role(target_org_id uuid)
RETURNS text
LANGUAGE sql SECURITY DEFINER SET search_path = public STABLE
AS $$
  SELECT role FROM organization_members
  WHERE organization_id = target_org_id
  AND user_id = (SELECT auth.uid())
  LIMIT 1;
$$;

-- Security hardening: Revoke direct PostgREST RPC access from anon / PUBLIC roles
REVOKE EXECUTE ON FUNCTION public.is_org_member(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.get_org_role(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_org_member(uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.get_org_role(uuid) TO authenticated, service_role;

-- Enable RLS
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE execution_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE checkpoints ENABLE ROW LEVEL SECURITY;
ALTER TABLE approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE tool_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Organizations
CREATE POLICY "org_select" ON organizations FOR SELECT TO authenticated USING (public.is_org_member(id));
CREATE POLICY "org_insert" ON organizations FOR INSERT TO authenticated WITH CHECK (length(trim(name)) > 0 AND length(trim(slug)) > 0 AND (SELECT auth.uid()) IS NOT NULL);
CREATE POLICY "org_update" ON organizations FOR UPDATE TO authenticated USING (public.get_org_role(id) = 'admin');
CREATE POLICY "org_delete" ON organizations FOR DELETE TO authenticated USING (public.get_org_role(id) = 'admin');

-- Organization Members
CREATE POLICY "org_members_select" ON organization_members FOR SELECT TO authenticated USING (user_id = (SELECT auth.uid()) OR public.is_org_member(organization_id));
CREATE POLICY "org_members_insert" ON organization_members FOR INSERT TO authenticated WITH CHECK (public.get_org_role(organization_id) = 'admin');
CREATE POLICY "org_members_update" ON organization_members FOR UPDATE TO authenticated USING (public.get_org_role(organization_id) = 'admin');
CREATE POLICY "org_members_delete" ON organization_members FOR DELETE TO authenticated USING (public.get_org_role(organization_id) = 'admin');

-- Agents
CREATE POLICY "agents_select" ON agents FOR SELECT TO authenticated USING (public.is_org_member(organization_id));
CREATE POLICY "agents_insert" ON agents FOR INSERT TO authenticated WITH CHECK (public.get_org_role(organization_id) = 'admin');
CREATE POLICY "agents_update" ON agents FOR UPDATE TO authenticated USING (public.get_org_role(organization_id) IN ('admin', 'operator'));
CREATE POLICY "agents_delete" ON agents FOR DELETE TO authenticated USING (public.get_org_role(organization_id) IN ('admin', 'operator'));

-- Missions
CREATE POLICY "missions_select" ON missions FOR SELECT TO authenticated USING (public.is_org_member(organization_id));
CREATE POLICY "missions_insert" ON missions FOR INSERT TO authenticated WITH CHECK (public.get_org_role(organization_id) IN ('admin', 'operator'));
CREATE POLICY "missions_update" ON missions FOR UPDATE TO authenticated USING (public.get_org_role(organization_id) IN ('admin', 'operator'));
CREATE POLICY "missions_delete" ON missions FOR DELETE TO authenticated USING (public.get_org_role(organization_id) IN ('admin', 'operator'));

-- Tasks
CREATE POLICY "tasks_select" ON tasks FOR SELECT TO authenticated USING (public.is_org_member(organization_id));
CREATE POLICY "tasks_insert" ON tasks FOR INSERT TO authenticated WITH CHECK (public.get_org_role(organization_id) IN ('admin', 'operator'));
CREATE POLICY "tasks_update" ON tasks FOR UPDATE TO authenticated USING (public.get_org_role(organization_id) IN ('admin', 'operator'));
CREATE POLICY "tasks_delete" ON tasks FOR DELETE TO authenticated USING (public.get_org_role(organization_id) IN ('admin', 'operator'));

-- Agent Runs
CREATE POLICY "agent_runs_select" ON agent_runs FOR SELECT TO authenticated USING (public.is_org_member(organization_id));
CREATE POLICY "agent_runs_insert" ON agent_runs FOR INSERT TO authenticated WITH CHECK (public.get_org_role(organization_id) IN ('admin', 'operator'));
CREATE POLICY "agent_runs_update" ON agent_runs FOR UPDATE TO authenticated USING (public.get_org_role(organization_id) IN ('admin', 'operator'));

-- Execution Steps
CREATE POLICY "execution_steps_select" ON execution_steps FOR SELECT TO authenticated USING (public.is_org_member(organization_id));
CREATE POLICY "execution_steps_insert" ON execution_steps FOR INSERT TO authenticated WITH CHECK (public.get_org_role(organization_id) IN ('admin', 'operator'));

-- Tools
CREATE POLICY "tools_select" ON tools FOR SELECT TO authenticated USING (true);
CREATE POLICY "tools_insert" ON tools FOR INSERT TO authenticated WITH CHECK (organization_id IS NULL OR public.get_org_role(organization_id) = 'admin');
CREATE POLICY "tools_update" ON tools FOR UPDATE TO authenticated USING (organization_id IS NULL OR public.get_org_role(organization_id) = 'admin');

-- Agent Tools
CREATE POLICY "agent_tools_select" ON agent_tools FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM agents WHERE id = agent_id AND public.is_org_member(organization_id)));
CREATE POLICY "agent_tools_insert" ON agent_tools FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM agents WHERE id = agent_id AND public.get_org_role(organization_id) = 'admin'));
CREATE POLICY "agent_tools_update" ON agent_tools FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM agents WHERE id = agent_id AND public.get_org_role(organization_id) = 'admin'));
CREATE POLICY "agent_tools_delete" ON agent_tools FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM agents WHERE id = agent_id AND public.get_org_role(organization_id) = 'admin'));

-- Memories
CREATE POLICY "memories_select" ON memories FOR SELECT TO authenticated USING (public.is_org_member(organization_id));
CREATE POLICY "memories_insert" ON memories FOR INSERT TO authenticated WITH CHECK (public.get_org_role(organization_id) IN ('admin', 'operator'));
CREATE POLICY "memories_update" ON memories FOR UPDATE TO authenticated USING (public.get_org_role(organization_id) IN ('admin', 'operator'));
CREATE POLICY "memories_delete" ON memories FOR DELETE TO authenticated USING (public.get_org_role(organization_id) IN ('admin', 'operator'));

-- Workspaces
CREATE POLICY "workspaces_select" ON workspaces FOR SELECT TO authenticated USING (public.is_org_member(organization_id));
CREATE POLICY "workspaces_insert" ON workspaces FOR INSERT TO authenticated WITH CHECK (public.get_org_role(organization_id) IN ('admin', 'operator'));

-- Checkpoints
CREATE POLICY "checkpoints_select" ON checkpoints FOR SELECT TO authenticated USING (public.is_org_member(organization_id));
CREATE POLICY "checkpoints_insert" ON checkpoints FOR INSERT TO authenticated WITH CHECK (public.get_org_role(organization_id) IN ('admin', 'operator'));

-- Approvals
CREATE POLICY "approvals_select" ON approvals FOR SELECT TO authenticated USING (public.is_org_member(organization_id));
CREATE POLICY "approvals_update" ON approvals FOR UPDATE TO authenticated USING (public.get_org_role(organization_id) IN ('admin', 'operator'));

-- Tool Executions
CREATE POLICY "tool_executions_select" ON tool_executions FOR SELECT TO authenticated USING (public.is_org_member(organization_id));
CREATE POLICY "tool_executions_insert" ON tool_executions FOR INSERT TO authenticated WITH CHECK (public.get_org_role(organization_id) IN ('admin', 'operator'));

-- Audit Logs
CREATE POLICY "audit_logs_select" ON audit_logs FOR SELECT TO authenticated USING (public.is_org_member(organization_id));
CREATE POLICY "audit_logs_insert" ON audit_logs FOR INSERT TO authenticated WITH CHECK (public.get_org_role(organization_id) IN ('admin', 'operator'));
