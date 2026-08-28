import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { validateBody } from '../middleware/validation.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router({ mergeParams: true });
router.use(requireAuth);

const createTaskSchema = z.object({
  mission_id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  status: z.string().default('pending'),
  dependencies: z.array(z.string()).optional()
});

router.get('/missions/:missionId/tasks', async (req: Request, res: Response) => {
  try {
    const { data, error } = await req.supabase!
      .from('tasks')
      .select('*')
      .eq('mission_id', req.params.missionId);
      
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/missions/:missionId/tasks', validateBody(createTaskSchema.omit({ mission_id: true })), async (req: Request, res: Response) => {
  try {
    const task = { ...req.body, mission_id: req.params.missionId };
    const { data, error } = await req.supabase!.from('tasks').insert(task).select().single();
    if (error) throw error;
    res.status(201).json({ success: true, data });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

router.get('/tasks/:id', async (req: Request, res: Response) => {
  try {
    const { data, error } = await req.supabase!.from('tasks').select('*').eq('id', req.params.id).single();
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(404).json({ success: false, error: err.message });
  }
});

router.patch('/tasks/:id', validateBody(z.object({ status: z.string().optional(), output: z.any().optional() })), async (req: Request, res: Response) => {
  try {
    const { data, error } = await req.supabase!.from('tasks').update(req.body).eq('id', req.params.id).select().single();
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

export default router;
