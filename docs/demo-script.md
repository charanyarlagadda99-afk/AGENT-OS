# AgentOS Demo Script

## Flagship Demo: Autonomous Software Engineering

### Setup
1. Start the API server: `npm run dev:api`
2. Start the web app: `npm run dev:web`
3. Open `http://localhost:5173`

### Demo Flow

#### Step 1: Create an Agent
- Navigate to `/agents/new`
- Name: "Engineering Agent"
- Model: gemini-2.5-flash
- Autonomy: CONFIRMED
- Assign all tools

#### Step 2: Create Mission
- Navigate to `/missions/new`
- Title: "Make demo-broken-repo production-ready"
- Objective: "Inspect the repository at demo/broken-repo, fix all issues (missing dependencies, failing tests, type errors, security vulnerabilities, incomplete documentation), and make it production-ready."
- Agent: Engineering Agent
- Success Criteria:
  - `npm test` exits 0
  - `npm run build` exits 0

#### Step 3: Start Mission
- Click "Start Mission"
- Watch the live execution in `/missions/:id`

#### What to Show
1. **Planning**: Agent inspects repo, creates task graph
2. **Execution**: Agent runs tools (file read, terminal, file write)
3. **Failure**: Tests fail initially
4. **Replanning**: Agent adapts plan based on test output
5. **Recovery**: Agent fixes issues and retries
6. **Verification**: Success criteria checked
7. **Checkpoint**: Auto-checkpoint every 5 steps

#### Step 4: Pause/Resume
- Click "Pause" during execution
- Show checkpoint created
- Click "Resume" — agent continues from checkpoint

#### Step 5: Show Results
- Mission COMPLETED
- All tests passing
- Build succeeds
- Files modified visible in workspace

### Known Issues in Demo Repo
1. Missing `cors` dependency
2. No environment variable validation
3. Wrong HTTP status codes
4. TypeScript type error (User.name as number)
5. Security: no input sanitization
6. Two failing tests
7. Incomplete README
