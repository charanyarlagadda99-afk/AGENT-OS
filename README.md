# AgentOS

### The Execution Environment for Autonomous AI Agents

AgentOS is an AI-native platform where autonomous agents can receive missions, create execution plans, use tools, browse the web, read and modify files, execute terminal commands in a sandbox, maintain persistent memory, delegate work to sub-agents, run multi-step tasks, pause and resume, recover from failures, create checkpoints, verify their own work, and request human approval when necessary.

## Architecture

```
MISSION → AGENT → PLAN → EXECUTE → OBSERVE → REPLAN → VERIFY → CHECKPOINT → COMPLETE
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, React Router, TanStack Query |
| Backend | Node.js, Express, TypeScript |
| Database | Supabase PostgreSQL, Supabase Auth |
| AI | Google Gemini (@google/genai) |
| Validation | Zod |

## Quick Start

### Prerequisites
- Node.js 18+
- Supabase project (URL + keys)
- Gemini API key

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Build shared package
npm run build:shared

# 3. Copy environment variables
cp .env.example .env
# Edit .env with your Supabase and Gemini credentials

# 4. Apply database migrations
# (Use Supabase CLI or run SQL files manually in Supabase Dashboard)
cd supabase && npx supabase db push

# 5. Start development servers
npm run dev
```

The web app will be available at `http://localhost:5173` and the API at `http://localhost:4000`.

### Demo Mode

Set `DEMO_MODE=true` in `.env` to bypass authentication during development.

## Project Structure

```
agentos/
├── apps/
│   ├── web/          # React frontend
│   │   └── src/
│   │       ├── components/
│   │       ├── pages/
│   │       ├── layouts/
│   │       ├── hooks/
│   │       ├── services/
│   │       └── lib/
│   └── api/          # Express backend
│       └── src/
│           ├── agents/       # Agent runtime, planner, orchestrator
│           ├── tools/        # Tool implementations
│           ├── sandbox/      # Sandboxed execution
│           ├── integrations/ # Gemini AI provider
│           ├── memory/       # Memory management
│           ├── workspace/    # File management
│           ├── policies/     # Permission & risk engine
│           ├── events/       # SSE event emitter
│           ├── routes/       # API routes
│           └── middleware/    # Auth, validation, error handling
├── packages/
│   └── shared/       # Zod schemas, types, constants
├── supabase/
│   ├── migrations/   # SQL migrations
│   └── seed.sql      # Demo data
├── demo/
│   └── broken-repo/  # Demo broken repository for showcase
└── docs/
```

## Features

- **Agent Creation & Configuration** — Name, model, autonomy level, tools, budget
- **Mission Management** — Create, start, pause, resume, cancel missions
- **Task Graph** — Visual DAG of execution tasks with dependencies
- **Live Execution Console** — Real-time SSE streaming of agent actions
- **Tool Runtime** — 18 built-in tools (filesystem, terminal, browser, memory, etc.)
- **Sandboxed Terminal** — Isolated command execution with policy enforcement
- **Persistent Memory** — Episodic, semantic, user, and agent memory types
- **Checkpointing** — Auto-checkpoint every 5 steps, manual checkpoint, restore
- **Human-in-the-Loop** — Approval queue for high-risk actions
- **Verification Engine** — Explicit success criteria validation
- **Sub-Agent Delegation** — Parent agents can spawn scoped child agents
- **Execution Replay** — Step-by-step replay of completed runs
- **Analytics** — Mission success rates, tool usage, runtime metrics

## License

MIT
