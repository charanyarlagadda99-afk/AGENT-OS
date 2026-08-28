import { EventEmitter } from 'events';

class AppEventEmitter extends EventEmitter {
  emitMissionEvent(missionId: string, event: string, data: any) {
    this.emit(`mission:${missionId}`, { event, data, timestamp: new Date().toISOString() });
  }

  subscribeToMission(missionId: string, listener: (data: any) => void) {
    this.on(`mission:${missionId}`, listener);
    return () => this.off(`mission:${missionId}`, listener);
  }
}

export const emitter = new AppEventEmitter();
