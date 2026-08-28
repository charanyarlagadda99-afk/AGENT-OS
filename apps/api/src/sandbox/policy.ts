export enum SideEffectType {
  READ_ONLY = 'READ_ONLY',
  LOW_RISK_WRITE = 'LOW_RISK_WRITE',
  HIGH_RISK_WRITE = 'HIGH_RISK_WRITE',
  DESTRUCTIVE = 'DESTRUCTIVE'
}

const ALLOWED_COMMANDS = new Set([
  'ls', 'cat', 'head', 'tail', 'grep', 'find', 'npm test', 'npm run build',
  'npm install', 'git status', 'git log', 'git diff', 'node', 'python', 'tsc', 'eslint'
]);

const READ_ONLY_COMMANDS = ['ls', 'cat', 'head', 'tail', 'grep', 'find', 'git status', 'git log', 'git diff'];
const BLOCKED_COMMANDS = ['rm -rf', 'shutdown', 'reboot', 'format', 'mkfs', 'dd', 'curl', 'wget'];

export function classifyCommand(command: string): SideEffectType {
  if (BLOCKED_COMMANDS.some(blocked => command.includes(blocked))) {
    return SideEffectType.DESTRUCTIVE;
  }
  const baseCmd = command.split(' ')[0];
  if (READ_ONLY_COMMANDS.includes(baseCmd) || READ_ONLY_COMMANDS.some(c => command.startsWith(c))) {
    return SideEffectType.READ_ONLY;
  }
  if (ALLOWED_COMMANDS.has(baseCmd) || Array.from(ALLOWED_COMMANDS).some(c => command.startsWith(c))) {
    return SideEffectType.LOW_RISK_WRITE;
  }
  return SideEffectType.HIGH_RISK_WRITE;
}

export function isAllowed(command: string): boolean {
  if (BLOCKED_COMMANDS.some(blocked => command.includes(blocked))) {
    return false;
  }
  const baseCmd = command.split(' ')[0];
  return ALLOWED_COMMANDS.has(baseCmd) || Array.from(ALLOWED_COMMANDS).some(c => command.startsWith(c));
}
