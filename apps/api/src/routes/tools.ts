import { Router, Request, Response } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { z } from 'zod';
import { validateBody } from '../middleware/validation.js';

const router = Router();
router.use(requireAuth);

const toolSchema = z.object({
  name: z.string(),
  description: z.string(),
  schema: z.record(z.any()),
  type: z.string().default('custom')
});

router.get('/tools', async (req: Request, res: Response) => {
  try {
    const { data, error } = await req.supabase!.from('tools').select('*').eq('org_id', req.orgId);
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/tools', validateBody(toolSchema), async (req: Request, res: Response) => {
  try {
    const tool = { ...req.body, org_id: req.orgId };
    const { data, error } = await req.supabase!.from('tools').insert(tool).select().single();
    if (error) throw error;
    res.status(201).json({ success: true, data });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

router.patch('/tools/:id', validateBody(toolSchema.partial()), async (req: Request, res: Response) => {
  try {
    const { data, error } = await req.supabase!.from('tools').update(req.body).eq('id', req.params.id).eq('org_id', req.orgId).select().single();
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

router.get('/agents/:agentId/tools', async (req: Request, res: Response) => {
  try {
    const { data, error } = await req.supabase!
      .from('agent_tools')
      .select('*, tools(*)')
      .eq('agent_id', req.params.agentId);
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/agents/:agentId/tools', validateBody(z.object({ tool_id: z.string() })), async (req: Request, res: Response) => {
  try {
    const { data, error } = await req.supabase!.from('agent_tools').insert({ agent_id: req.params.agentId, tool_id: req.body.tool_id }).select().single();
    if (error) throw error;
    res.status(201).json({ success: true, data });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

router.delete('/agents/:agentId/tools/:toolId', async (req: Request, res: Response) => {
  try {
    const { error } = await req.supabase!.from('agent_tools').delete().match({ agent_id: req.params.agentId, tool_id: req.params.toolId });
    if (error) throw error;
    res.json({ success: true, data: { deleted: true } });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

export default router;
