import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { validateBody } from '../middleware/validation.js';
import { requireAuth } from '../middleware/auth.js';
// We'd import from @agentos/shared, but using minimal zod schemas here for illustration
import { AgentSchema } from '@agentos/shared'; 

const router = Router();
router.use(requireAuth);

const createAgentSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  model: z.string().optional(),
  system_prompt: z.string().optional()
});

router.get('/', async (req: Request, res: Response) => {
  try {
    const { data, error } = await req.supabase!.from('agents').select('*').eq('org_id', req.orgId);
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/', validateBody(createAgentSchema), async (req: Request, res: Response) => {
  try {
    const agent = { ...req.body, org_id: req.orgId };
    const { data, error } = await req.supabase!.from('agents').insert(agent).select().single();
    if (error) throw error;
    res.status(201).json({ success: true, data });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { data, error } = await req.supabase!.from('agents').select('*').eq('id', req.params.id).eq('org_id', req.orgId).single();
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(404).json({ success: false, error: err.message });
  }
});

router.patch('/:id', validateBody(createAgentSchema.partial()), async (req: Request, res: Response) => {
  try {
    const { data, error } = await req.supabase!.from('agents').update(req.body).eq('id', req.params.id).eq('org_id', req.orgId).select().single();
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { error } = await req.supabase!.from('agents').delete().eq('id', req.params.id).eq('org_id', req.orgId);
    if (error) throw error;
    res.json({ success: true, data: { deleted: true } });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

router.post('/:id/pause', async (req: Request, res: Response) => {
  try {
    const { data, error } = await req.supabase!.from('agents').update({ status: 'paused' }).eq('id', req.params.id).eq('org_id', req.orgId).select().single();
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

router.post('/:id/resume', async (req: Request, res: Response) => {
  try {
    const { data, error } = await req.supabase!.from('agents').update({ status: 'active' }).eq('id', req.params.id).eq('org_id', req.orgId).select().single();
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

router.post('/:id/terminate', async (req: Request, res: Response) => {
  try {
    const { data, error } = await req.supabase!.from('agents').update({ status: 'terminated' }).eq('id', req.params.id).eq('org_id', req.orgId).select().single();
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

export default router;
