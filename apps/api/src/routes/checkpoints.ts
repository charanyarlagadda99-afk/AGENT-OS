import { Router, Request, Response } from 'express';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

router.get('/', async (req: Request, res: Response) => {
  try {
    const { data, error } = await req.supabase!.from('checkpoints').select('*').eq('org_id', req.orgId);
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { data, error } = await req.supabase!.from('checkpoints').select('*').eq('id', req.params.id).eq('org_id', req.orgId).single();
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(404).json({ success: false, error: err.message });
  }
});

router.post('/:id/restore', async (req: Request, res: Response) => {
  try {
    // In a real implementation, restoring a checkpoint involves resetting mission state, db state, and agent context
    const { data, error } = await req.supabase!.from('checkpoints').select('*').eq('id', req.params.id).eq('org_id', req.orgId).single();
    if (error) throw error;
    
    // Mock restoration logic
    res.json({ success: true, data: { restored: true, checkpoint: data } });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

export default router;
