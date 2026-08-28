import { AgentState, MissionState, TaskState } from '@agentos/shared';

const VALID_AGENT_TRANSITIONS: Record<AgentState, AgentState[]> = {
  IDLE: ['PLANNING', 'RUNNING', 'TERMINATED'],
  PLANNING: ['RUNNING', 'PAUSED', 'FAILED', 'TERMINATED'],
  RUNNING: ['PAUSED', 'WAITING_APPROVAL', 'FAILED', 'COMPLETED', 'TERMINATED'],
  PAUSED: ['RUNNING', 'TERMINATED'],
  WAITING_APPROVAL: ['RUNNING', 'PAUSED', 'FAILED', 'TERMINATED'],
  FAILED: ['PLANNING', 'RUNNING', 'TERMINATED'],
  COMPLETED: ['IDLE', 'PLANNING', 'RUNNING', 'TERMINATED'],
  TERMINATED: [],
};

const VALID_MISSION_TRANSITIONS: Record<MissionState, MissionState[]> = {
  QUEUED: ['PLANNING', 'RUNNING', 'CANCELLED'],
  PLANNING: ['RUNNING', 'PAUSED', 'FAILED', 'CANCELLED'],
  RUNNING: ['WAITING', 'PAUSED', 'VERIFYING', 'FAILED', 'CANCELLED'],
  WAITING: ['RUNNING', 'PAUSED', 'FAILED', 'CANCELLED'],
  PAUSED: ['RUNNING', 'CANCELLED'],
  VERIFYING: ['COMPLETED', 'FAILED', 'RUNNING', 'CANCELLED'],
  COMPLETED: ['QUEUED', 'PLANNING', 'RUNNING'],
  FAILED: ['QUEUED', 'PLANNING', 'RUNNING'],
  CANCELLED: [],
};

export function validateTransition(
  entityType: 'agent' | 'mission',
  fromState: string,
  toState: string
): boolean {
  if (entityType === 'agent') {
    const allowed = VALID_AGENT_TRANSITIONS[fromState as AgentState];
    return allowed ? allowed.includes(toState as AgentState) : false;
  } else if (entityType === 'mission') {
    const allowed = VALID_MISSION_TRANSITIONS[fromState as MissionState];
    return allowed ? allowed.includes(toState as MissionState) : false;
  }
  return false;
}
