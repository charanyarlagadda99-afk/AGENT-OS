import { Router, Request, Response } from 'express';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

router.get('/', async (req: Request, res: Response) => {
  try {
    const { data, error } = await req.supabase!.from('runs').select('*').eq('org_id', req.orgId);
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { data, error } = await req.supabase!.from('runs').select('*').eq('id', req.params.id).eq('org_id', req.orgId).single();
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(404).json({ success: false, error: err.message });
  }
});

router.get('/:id/steps', async (req: Request, res: Response) => {
  try {
    const { data, error } = await req.supabase!.from('run_steps').select('*').eq('run_id', req.params.id).order('created_at', { ascending: true });
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
