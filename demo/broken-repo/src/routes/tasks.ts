import { Router } from 'express';
import { z } from 'zod';

const router = Router();

interface Task {
  id: number;
  title: string;
  completed: boolean;
  createdAt: string;
}

const tasks: Task[] = [];
let nextId = 1;

const CreateTaskSchema = z.object({
  title: z.string().min(1),
});

router.get('/', (_req, res) => {
  res.json({ tasks });
});

router.post('/', (req, res) => {
  const result = CreateTaskSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: result.error.format() });
  }

  const task: Task = {
    id: nextId++,
    title: result.data.title,
    completed: false,
    createdAt: new Date().toISOString(),
  };

  tasks.push(task);
  res.status(201).json({ task });
});

router.patch('/:id/complete', (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find((t) => t.id === id);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  task.completed = true;
  res.json({ task });
});

router.delete('/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }
  tasks.splice(index, 1);
  res.status(204).send();
});

export { router as taskRouter };
