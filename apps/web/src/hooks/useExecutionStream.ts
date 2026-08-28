import { useState, useEffect } from 'react';

export interface StreamCallbacks {
  onStepCompleted?: (event: any) => void;
}

export function useExecutionStream(missionId: string, callbacks?: StreamCallbacks) {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    if (!missionId) return;

    const eventSource = new EventSource(`/api/missions/${missionId}/stream`);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setEvents((prev) => [...prev, data]);
        if (callbacks?.onStepCompleted) {
          callbacks.onStepCompleted(data);
        }
      } catch (err) {
        // Safe parse
      }
    };

    return () => {
      eventSource.close();
    };
  }, [missionId]);

  return events;
}
