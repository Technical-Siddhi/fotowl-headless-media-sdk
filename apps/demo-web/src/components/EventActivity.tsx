import React, { useState } from 'react';
import { useMediaEvent } from '@fotowl/media-react';
import type { MediaAsset } from '@fotowl/media-react';

interface EventLog {
  id: string;
  type: 'view' | 'download';
  title: string;
  timestamp: string;
}

export const EventActivity: React.FC = () => {
  const [logs, setLogs] = useState<EventLog[]>([]);

  useMediaEvent('media:view', (payload: { asset: MediaAsset }) => {
    const newLog: EventLog = {
      id: Math.random().toString(36).substring(2, 9),
      type: 'view',
      title: payload.asset.title || 'Untitled Asset',
      timestamp: new Date().toLocaleTimeString(),
    };
    setLogs((prev) => [newLog, ...prev.slice(0, 9)]);
  });

  useMediaEvent('media:download', (payload: { asset: MediaAsset }) => {
    const newLog: EventLog = {
      id: Math.random().toString(36).substring(2, 9),
      type: 'download',
      title: payload.asset.title || 'Untitled Asset',
      timestamp: new Date().toLocaleTimeString(),
    };
    setLogs((prev) => [newLog, ...prev.slice(0, 9)]);
  });

  return (
    <aside className="event-activity-widget" aria-label="SDK Event Activity Log">
      <header className="event-activity-header">
        <h3 className="event-activity-title">Live SDK Event Activity</h3>
        <span className="event-activity-badge">SDK Event Stream</span>
      </header>

      {logs.length === 0 ? (
        <p className="event-activity-empty">No SDK events recorded yet. Click or download a media card to trigger events.</p>
      ) : (
        <ul className="event-activity-list">
          {logs.map((log) => (
            <li key={log.id} className="event-activity-item">
              <span className={`event-activity-type ${log.type}`}>{log.type}</span>
              <span className="event-activity-text">{log.title}</span>
              <span className="event-activity-time">{log.timestamp}</span>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
};
