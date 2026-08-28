import { Router, Request, Response } from 'express';
import { requireAuth } from '../middleware/auth.js';
import fs from 'fs/promises';
import path from 'path';

const router = Router();
router.use(requireAuth);

router.get('/', async (req: Request, res: Response) => {
  try {
    const { data, error } = await req.supabase!.from('workspaces').select('*').eq('org_id', req.orgId);
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

async function getWorkspaceRoot(supabase: any, workspaceId: string, orgId: string): Promise<string> {
  const { data, error } = await supabase.from('workspaces').select('root_path').eq('id', workspaceId).eq('org_id', orgId).single();
  if (error || !data) throw new Error('Workspace not found');
  return data.root_path;
}

const safePath = (root: string, requestedPath: string) => {
  const resolved = path.resolve(root, requestedPath || '');
  if (!resolved.startsWith(root)) {
    throw new Error('Path traversal detected');
  }
  return resolved;
};

router.get('/:id/tree', async (req: Request, res: Response) => {
  try {
    const root = await getWorkspaceRoot(req.supabase, req.params.id as string, req.orgId!);
    
    async function buildTree(dir: string): Promise<any> {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      return Promise.all(entries.map(async (entry) => {
        const fullPath = path.join(dir, entry.name);
        const isDirectory = entry.isDirectory();
        return {
          name: entry.name,
          path: path.relative(root, fullPath),
          isDirectory,
          children: isDirectory ? await buildTree(fullPath) : undefined
        };
      }));
    }
    
    const tree = await buildTree(root);
    res.json({ success: true, data: tree });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

router.get('/:id/file', async (req: Request, res: Response) => {
  try {
    const root = await getWorkspaceRoot(req.supabase, req.params.id as string, req.orgId!);
    const filePath = safePath(root, req.query.path as string);
    const content = await fs.readFile(filePath, 'utf-8');
    res.json({ success: true, data: { content } });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

router.post('/:id/file', async (req: Request, res: Response) => {
  try {
    const root = await getWorkspaceRoot(req.supabase, req.params.id as string, req.orgId!);
    const filePath = safePath(root, req.body.path);
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, req.body.content || '');
    res.status(201).json({ success: true, data: { path: req.body.path } });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

router.patch('/:id/file', async (req: Request, res: Response) => {
  try {
    const root = await getWorkspaceRoot(req.supabase, req.params.id as string, req.orgId!);
    const filePath = safePath(root, req.body.path);
    await fs.writeFile(filePath, req.body.content || '');
    res.json({ success: true, data: { path: req.body.path } });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

router.delete('/:id/file', async (req: Request, res: Response) => {
  try {
    const root = await getWorkspaceRoot(req.supabase, req.params.id as string, req.orgId!);
    const filePath = safePath(root, req.query.path as string);
    await fs.rm(filePath, { recursive: true, force: true });
    res.json({ success: true, data: { deleted: true } });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

export default router;
