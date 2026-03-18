'use client';

import { STREAMING_SERVERS } from '@/services/streaming';

interface ServerSelectorProps {
  activeServer: string;
  onSelect: (serverId: string) => void;
}

export default function ServerSelector({ activeServer, onSelect }: ServerSelectorProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="text-sm font-semibold text-text flex items-center gap-2">
          <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
          </svg>
          Streaming Servers
        </h3>
        <span className="text-xs text-muted">{STREAMING_SERVERS.length} Sources Available</span>
      </div>
      
      {/* Scrollable Container for massive server list */}
      <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-surface scrollbar-track-transparent snap-x">
        {STREAMING_SERVERS.map((server) => {
          const isActive = activeServer === server.id;
          
          // Determine color scheme based on server family
          let baseAccent = "border-border hover:border-primary/50 text-text/80 hover:text-text bg-surface/50 hover:bg-surface";
          if (server.id.includes('vidlink')) baseAccent = "border-border hover:border-blue-500/50 text-text/80 hover:text-text bg-surface/50 hover:bg-surface";
          if (server.id.includes('vidsrc')) baseAccent = "border-border hover:border-green-500/50 text-text/80 hover:text-text bg-surface/50 hover:bg-surface";
          if (server.id.includes('videasy') || server.id.includes('vidfast')) baseAccent = "border-border hover:border-purple-500/50 text-text/80 hover:text-text bg-surface/50 hover:bg-surface";

          return (
            <button
              key={server.id}
              onClick={() => onSelect(server.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                isActive
                  ? 'bg-gradient-to-r from-accent to-accent-hover text-white shadow-lg shadow-accent/25 scale-105 ring-1 ring-white/20'
                  : 'bg-surface text-muted hover:bg-surface-hover hover:text-white hover:scale-105 border border-border/50'
              }`}
            >
              {isActive && (
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              )}
              {server.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
