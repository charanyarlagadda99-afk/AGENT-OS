-- Seed Demo Organization
INSERT INTO organizations (id, name, slug)
VALUES ('00000000-0000-0000-0000-000000000001', 'AgentOS Demo', 'agentos-demo')
ON CONFLICT (id) DO NOTHING;

-- Seed Tools
INSERT INTO tools (name, description, input_schema, output_schema, permission_scope, risk_level, side_effect_type)
VALUES
('filesystem.read', 'Read file contents from the workspace', '{"type":"object","properties":{"path":{"type":"string"}},"required":["path"]}', '{"type":"object","properties":{"content":{"type":"string"}}}', 'FILESYSTEM', 'LOW', 'READ_ONLY'),
('filesystem.write', 'Write file contents to the workspace', '{"type":"object","properties":{"path":{"type":"string"},"content":{"type":"string"}},"required":["path","content"]}', '{"type":"object","properties":{"success":{"type":"boolean"}}}', 'FILESYSTEM', 'MEDIUM', 'LOW_RISK_WRITE'),
('filesystem.list', 'List files in a directory', '{"type":"object","properties":{"path":{"type":"string"}},"required":["path"]}', '{"type":"object","properties":{"files":{"type":"array","items":{"type":"string"}}}}', 'FILESYSTEM', 'LOW', 'READ_ONLY'),
('terminal.execute', 'Execute a command in the terminal', '{"type":"object","properties":{"command":{"type":"string"}},"required":["command"]}', '{"type":"object","properties":{"stdout":{"type":"string"},"stderr":{"type":"string"},"exitCode":{"type":"number"}}}', 'TERMINAL', 'HIGH', 'HIGH_RISK_WRITE'),
('browser.search', 'Search the web using a browser', '{"type":"object","properties":{"query":{"type":"string"}},"required":["query"]}', '{"type":"object","properties":{"results":{"type":"array","items":{"type":"string"}}}}', 'BROWSER', 'LOW', 'READ_ONLY'),
('browser.open', 'Open a URL in the browser', '{"type":"object","properties":{"url":{"type":"string"}},"required":["url"]}', '{"type":"object","properties":{"title":{"type":"string"},"content":{"type":"string"}}}', 'BROWSER', 'LOW', 'READ_ONLY'),
('browser.extract', 'Extract structured data from the current page', '{"type":"object","properties":{"selector":{"type":"string"}},"required":["selector"]}', '{"type":"object","properties":{"data":{"type":"array","items":{"type":"string"}}}}', 'BROWSER', 'LOW', 'READ_ONLY'),
('http.request', 'Make an HTTP request', '{"type":"object","properties":{"url":{"type":"string"},"method":{"type":"string"},"body":{"type":"string"}},"required":["url","method"]}', '{"type":"object","properties":{"status":{"type":"number"},"data":{"type":"string"}}}', 'HTTP', 'MEDIUM', 'HIGH_RISK_WRITE'),
('memory.search', 'Search the agents long-term memory', '{"type":"object","properties":{"query":{"type":"string"}},"required":["query"]}', '{"type":"object","properties":{"memories":{"type":"array","items":{"type":"object"}}}}', 'MEMORY', 'LOW', 'READ_ONLY'),
('memory.store', 'Store a memory in the agents long-term memory', '{"type":"object","properties":{"content":{"type":"string"},"importance":{"type":"number"}},"required":["content"]}', '{"type":"object","properties":{"success":{"type":"boolean"}}}', 'MEMORY', 'LOW', 'LOW_RISK_WRITE'),
('task.create', 'Create a new task for a mission', '{"type":"object","properties":{"title":{"type":"string"},"description":{"type":"string"}},"required":["title"]}', '{"type":"object","properties":{"taskId":{"type":"string"}}}', 'TASK', 'LOW', 'LOW_RISK_WRITE'),
('task.update', 'Update an existing task', '{"type":"object","properties":{"taskId":{"type":"string"},"status":{"type":"string"}},"required":["taskId","status"]}', '{"type":"object","properties":{"success":{"type":"boolean"}}}', 'TASK', 'LOW', 'LOW_RISK_WRITE'),
('task.complete', 'Mark a task as complete', '{"type":"object","properties":{"taskId":{"type":"string"},"output":{"type":"string"}},"required":["taskId","output"]}', '{"type":"object","properties":{"success":{"type":"boolean"}}}', 'TASK', 'LOW', 'LOW_RISK_WRITE'),
('agent.spawn', 'Spawn a new sub-agent for a task', '{"type":"object","properties":{"role":{"type":"string"},"instructions":{"type":"string"}},"required":["role","instructions"]}', '{"type":"object","properties":{"agentId":{"type":"string"}}}', 'AGENT', 'MEDIUM', 'HIGH_RISK_WRITE'),
('agent.message', 'Send a message to another agent', '{"type":"object","properties":{"agentId":{"type":"string"},"message":{"type":"string"}},"required":["agentId","message"]}', '{"type":"object","properties":{"response":{"type":"string"}}}', 'AGENT', 'LOW', 'LOW_RISK_WRITE'),
('checkpoint.create', 'Create a checkpoint of the current state', '{"type":"object","properties":{"label":{"type":"string"}},"required":["label"]}', '{"type":"object","properties":{"checkpointId":{"type":"string"}}}', 'CHECKPOINT', 'LOW', 'LOW_RISK_WRITE'),
('checkpoint.restore', 'Restore a previous checkpoint', '{"type":"object","properties":{"checkpointId":{"type":"string"}},"required":["checkpointId"]}', '{"type":"object","properties":{"success":{"type":"boolean"}}}', 'CHECKPOINT', 'HIGH', 'DESTRUCTIVE'),
('approval.request', 'Request user approval for an action', '{"type":"object","properties":{"action_type":{"type":"string"},"action_payload":{"type":"object"}},"required":["action_type","action_payload"]}', '{"type":"object","properties":{"approved":{"type":"boolean"},"reason":{"type":"string"}}}', 'APPROVAL', 'LOW', 'LOW_RISK_WRITE')
ON CONFLICT DO NOTHING;
