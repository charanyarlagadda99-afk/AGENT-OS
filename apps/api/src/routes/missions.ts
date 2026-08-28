import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { validateBody, validateQuery } from '../middleware/validation.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

const querySchema = z.object({
  status: z.string().optional(),
  agent_id: z.string().optional(),
  priority: z.string().optional()
});

const createMissionSchema = z.object({
  title: z.string(),
  description: z.string(),
  agent_id: z.string(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  workspace_id: z.string().optional()
});

router.get('/', validateQuery(querySchema), async (req: Request, res: Response) => {
  try {
    let query = req.supabase!.from('missions').select('*').eq('org_id', req.orgId);
    
    if (req.query.status) query = query.eq('status', req.query.status);
    if (req.query.agent_id) query = query.eq('agent_id', req.query.agent_id);
    if (req.query.priority) query = query.eq('priority', req.query.priority);

    const { data, error } = await query;
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/', validateBody(createMissionSchema), async (req: Request, res: Response) => {
  try {
    const mission = { ...req.body, org_id: req.orgId, status: 'pending' };
    const { data, error } = await req.supabase!.from('missions').insert(mission).select().single();
    if (error) throw error;
    res.status(201).json({ success: true, data });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { data, error } = await req.supabase!
      .from('missions')
      .select('*, tasks(*), runs(*)')
      .eq('id', req.params.id)
      .eq('org_id', req.orgId)
      .single();
      
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(404).json({ success: false, error: err.message });
  }
});

router.patch('/:id', validateBody(createMissionSchema.partial()), async (req: Request, res: Response) => {
  try {
    const { data, error } = await req.supabase!.from('missions').update(req.body).eq('id', req.params.id).eq('org_id', req.orgId).select().single();
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

router.post('/:id/start', async (req: Request, res: Response) => {
  try {
    const { data, error } = await req.supabase!.from('missions').update({ status: 'running' }).eq('id', req.params.id).eq('org_id', req.orgId).select().single();
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

router.post('/:id/pause', async (req: Request, res: Response) => {
  try {
    const { data, error } = await req.supabase!.from('missions').update({ status: 'paused' }).eq('id', req.params.id).eq('org_id', req.orgId).select().single();
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

router.post('/:id/resume', async (req: Request, res: Response) => {
  try {
    const { data, error } = await req.supabase!.from('missions').update({ status: 'running' }).eq('id', req.params.id).eq('org_id', req.orgId).select().single();
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

router.post('/:id/cancel', async (req: Request, res: Response) => {
  try {
    const { data, error } = await req.supabase!.from('missions').update({ status: 'cancelled' }).eq('id', req.params.id).eq('org_id', req.orgId).select().single();
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

export default router;
