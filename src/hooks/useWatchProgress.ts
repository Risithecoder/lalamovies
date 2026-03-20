/**
 * useWatchProgress Hook
 * ---------------------
 * Encapsulates all localStorage read/write logic for series episode
 * watch progress. No component should touch localStorage directly for
 * series progress — use this hook instead.
 *
 * Imports from existing project: none (standalone hook).
 * Storage keys: watch_progress_{seriesId}_{episodeId}
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

export interface WatchProgressEntry {
  seriesId: string;
  episodeId: string;
  timestamp: number; // seconds into the episode
  duration: number; // total episode duration in seconds
  completed: boolean;
  updatedAt: number; // Date.now()
}

const STORAGE_PREFIX = 'watch_progress_';

function getKey(seriesId: string, episodeId: string): string {
  return `${STORAGE_PREFIX}${seriesId}_${episodeId}`;
}

function readEntry(seriesId: string, episodeId: string): WatchProgressEntry | null {
  try {
    const raw = localStorage.getItem(getKey(seriesId, episodeId));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeEntry(entry: WatchProgressEntry): void {
  try {
    localStorage.setItem(getKey(entry.seriesId, entry.episodeId), JSON.stringify(entry));
  } catch {
    // quota exceeded or unavailable — silently fail
  }
}

/** Read all watch_progress_* entries from localStorage. */
export function getAllWatchProgress(): WatchProgressEntry[] {
  const entries: WatchProgressEntry[] = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(STORAGE_PREFIX)) {
        const raw = localStorage.getItem(key);
        if (raw) {
          entries.push(JSON.parse(raw));
        }
      }
    }
  } catch {
    // ignore
  }
  return entries.sort((a, b) => b.updatedAt - a.updatedAt);
}

// ── Hook: single episode progress ──────────────────────────────────────

export function useWatchProgress(seriesId: string, episodeId: string) {
  const [progress, setProgress] = useState<WatchProgressEntry | null>(null);
  const saveTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const latestRef = useRef<{ timestamp: number; duration: number }>({
    timestamp: 0,
    duration: 0,
  });

  // Load on mount
  useEffect(() => {
    const entry = readEntry(seriesId, episodeId);
    setProgress(entry);
  }, [seriesId, episodeId]);

  /** Save progress immediately. */
  const saveProgress = useCallback(
    (timestamp: number, duration: number) => {
      const completed = duration > 0 && timestamp / duration >= 0.95;
      const entry: WatchProgressEntry = {
        seriesId,
        episodeId,
        timestamp,
        duration,
        completed,
        updatedAt: Date.now(),
      };
      writeEntry(entry);
      setProgress(entry);
    },
    [seriesId, episodeId]
  );

  /** Update the latest ref (called on every timeupdate, cheap). */
  const updateLatest = useCallback((timestamp: number, duration: number) => {
    latestRef.current = { timestamp, duration };
  }, []);

  /** Start auto-saving every 5 seconds. */
  const startAutoSave = useCallback(() => {
    if (saveTimerRef.current) return;
    saveTimerRef.current = setInterval(() => {
      const { timestamp, duration } = latestRef.current;
      if (duration > 0) {
        saveProgress(timestamp, duration);
      }
    }, 5000);
  }, [saveProgress]);

  /** Stop auto-saving. */
  const stopAutoSave = useCallback(() => {
    if (saveTimerRef.current) {
      clearInterval(saveTimerRef.current);
      saveTimerRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (saveTimerRef.current) {
        clearInterval(saveTimerRef.current);
      }
      // Final save
      const { timestamp, duration } = latestRef.current;
      if (duration > 0) {
        const completed = timestamp / duration >= 0.95;
        writeEntry({
          seriesId,
          episodeId,
          timestamp,
          duration,
          completed,
          updatedAt: Date.now(),
        });
      }
    };
  }, [seriesId, episodeId]);

  /** Get the resume timestamp (returns 0 if completed or no progress). */
  const getResumeTimestamp = useCallback((): number => {
    if (!progress) return 0;
    if (progress.completed) return 0;
    if (progress.duration > 0 && progress.timestamp / progress.duration >= 0.95) return 0;
    return progress.timestamp;
  }, [progress]);

  return {
    progress,
    saveProgress,
    updateLatest,
    startAutoSave,
    stopAutoSave,
    getResumeTimestamp,
  };
}

// ── Hook: all series progress (for homepage rows) ──────────────────────

export function useAllWatchProgress() {
  const [entries, setEntries] = useState<WatchProgressEntry[]>([]);

  useEffect(() => {
    setEntries(getAllWatchProgress());
  }, []);

  return entries;
}
