import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { validateBody, validateQuery } from '../middleware/validation.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

const memoryQuerySchema = z.object({
  agent_id: z.string().optional(),
  type: z.string().optional()
});

const createMemorySchema = z.object({
  agent_id: z.string(),
  content: z.string(),
  type: z.string().default('observation'),
  metadata: z.record(z.any()).optional()
});

router.get('/', validateQuery(memoryQuerySchema), async (req: Request, res: Response) => {
  try {
    let query = req.supabase!.from('memories').select('*').eq('org_id', req.orgId);
    
    if (req.query.agent_id) query = query.eq('agent_id', req.query.agent_id);
    if (req.query.type) query = query.eq('type', req.query.type);

    const { data, error } = await query;
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/', validateBody(createMemorySchema), async (req: Request, res: Response) => {
  try {
    const memory = { ...req.body, org_id: req.orgId };
    const { data, error } = await req.supabase!.from('memories').insert(memory).select().single();
    if (error) throw error;
    res.status(201).json({ success: true, data });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

router.get('/search', async (req: Request, res: Response) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ success: false, error: 'Query parameter is required' });
    }
    
    // Simplistic text search for MVP, normally use pgvector for embeddings
    const { data, error } = await req.supabase!.from('memories')
      .select('*')
      .eq('org_id', req.orgId)
      .ilike('content', `%${query}%`);
      
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { error } = await req.supabase!.from('memories').delete().eq('id', req.params.id).eq('org_id', req.orgId);
    if (error) throw error;
    res.json({ success: true, data: { deleted: true } });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

export default router;
