/**
 * VideoPlayer
 * -----------
 * Full custom video player with HLS support (hls.js loaded async),
 * custom controls overlay, keyboard shortcuts, progress persistence,
 * skip intro, and next episode overlay.
 *
 * Imports from existing project: none (standalone player).
 * External dependency: hls.js loaded from CDN on mount.
 */

'use client';

import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { Episode, Season, formatDuration, getNextEpisode } from '@/lib/seriesData';
import { useWatchProgress } from '@/hooks/useWatchProgress';
import SkipIntroButton from './SkipIntroButton';
import NextEpisodeOverlay from './NextEpisodeOverlay';

// ── Types ──────────────────────────────────────────────────────────────

interface VideoPlayerProps {
  episode: Episode;
  season: Season;
  seriesId: string;
  seriesTitle: string;
  onNavigateToEpisode: (episodeId: string) => void;
  className?: string;
}

interface PlayerState {
  playing: boolean;
  currentTime: number;
  duration: number;
  buffered: number; // 0–1
  volume: number;
  muted: boolean;
  playbackRate: number;
  fullscreen: boolean;
}

// ── useVideoPlayer Hook ────────────────────────────────────────────────

function useVideoPlayer(
  videoRef: React.RefObject<HTMLVideoElement | null>,
  episode: Episode,
  seriesId: string
) {
  const [state, setState] = useState<PlayerState>({
    playing: false,
    currentTime: 0,
    duration: 0,
    buffered: 0,
    volume: 1,
    muted: false,
    playbackRate: 1,
    fullscreen: false,
  });

  const [error, setError] = useState<string | null>(null);

  const {
    saveProgress,
    updateLatest,
    startAutoSave,
    stopAutoSave,
    getResumeTimestamp,
    progress,
  } = useWatchProgress(seriesId, episode.id);

  // HLS / source setup
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hlsInstance: { destroy: () => void } | null = null;
    let cancelled = false;

    setError(null);

    const isHLS = episode.videoUrl.endsWith('.m3u8') || episode.videoUrl.includes('.m3u8');
    const nativeHLS = video.canPlayType('application/vnd.apple.mpegurl');

    if (isHLS && !nativeHLS) {
      // Dynamic import of hls.js (code-split, no CDN fragility)
      import('hls.js').then((mod) => {
        if (cancelled) return;
        const Hls = mod.default;
        if (Hls.isSupported()) {
          const hls = new Hls({
            enableWorker: true,
            lowLatencyMode: false,
          });

          hls.on(Hls.Events.ERROR, (_event: string, data: { fatal: boolean; type: string }) => {
            if (data.fatal) {
              console.error('HLS fatal error:', data);
              // Try to recover, or fall back
              if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
                hls.startLoad();
              } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
                hls.recoverMediaError();
              } else {
                setError('Failed to load video stream. Please try another episode.');
                hls.destroy();
              }
            }
          });

          hls.loadSource(episode.videoUrl);
          hls.attachMedia(video);
          hlsInstance = hls;
        } else {
          // hls.js not supported — try native
          video.src = episode.videoUrl;
          video.load();
        }
      }).catch((err) => {
        console.error('Failed to load hls.js:', err);
        // Fallback: try setting src directly (works on Safari)
        video.src = episode.videoUrl;
        video.load();
      });
    } else {
      // MP4 or native HLS (Safari)
      video.src = episode.videoUrl;
      video.load();
    }

    // Error listener on the video element itself
    const onError = () => {
      const mediaError = video.error;
      if (mediaError) {
        console.error('Video error:', mediaError.code, mediaError.message);
        setError(
          mediaError.code === MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED
            ? 'Video format not supported. Please try another episode.'
            : `Playback error: ${mediaError.message || 'Unknown error'}`
        );
      }
    };
    video.addEventListener('error', onError);

    return () => {
      cancelled = true;
      hlsInstance?.destroy();
      video.removeEventListener('error', onError);
      video.pause();
      video.removeAttribute('src');
      video.load(); // reset the element
    };
  }, [episode.videoUrl, videoRef]);

  // Resume from saved position
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !progress) return;

    const handleCanPlay = () => {
      const resume = getResumeTimestamp();
      if (resume > 0) {
        video.currentTime = resume;
      }
    };

    video.addEventListener('canplay', handleCanPlay, { once: true });
    return () => video.removeEventListener('canplay', handleCanPlay);
  }, [videoRef, progress, getResumeTimestamp]);

  // Time/progress updates
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onTimeUpdate = () => {
      const ct = video.currentTime;
      const dur = video.duration || 0;
      const buf =
        video.buffered.length > 0
          ? video.buffered.end(video.buffered.length - 1) / (dur || 1)
          : 0;

      setState((s) => ({
        ...s,
        currentTime: ct,
        duration: dur,
        buffered: buf,
      }));
      updateLatest(ct, dur);
    };

    const onPlay = () => {
      setState((s) => ({ ...s, playing: true }));
      startAutoSave();
    };
    const onPause = () => {
      setState((s) => ({ ...s, playing: false }));
      stopAutoSave();
      const ct = video.currentTime;
      const dur = video.duration || 0;
      if (dur > 0) saveProgress(ct, dur);
    };
    const onEnded = () => {
      setState((s) => ({ ...s, playing: false }));
      stopAutoSave();
      const dur = video.duration || 0;
      if (dur > 0) saveProgress(dur, dur);
    };
    const onVolumeChange = () => {
      setState((s) => ({ ...s, volume: video.volume, muted: video.muted }));
    };
    const onDurationChange = () => {
      setState((s) => ({ ...s, duration: video.duration || 0 }));
    };

    video.addEventListener('timeupdate', onTimeUpdate);
    video.addEventListener('play', onPlay);
    video.addEventListener('pause', onPause);
    video.addEventListener('ended', onEnded);
    video.addEventListener('volumechange', onVolumeChange);
    video.addEventListener('durationchange', onDurationChange);

    return () => {
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.removeEventListener('play', onPlay);
      video.removeEventListener('pause', onPause);
      video.removeEventListener('ended', onEnded);
      video.removeEventListener('volumechange', onVolumeChange);
      video.removeEventListener('durationchange', onDurationChange);
    };
  }, [videoRef, updateLatest, saveProgress, startAutoSave, stopAutoSave]);

  // Actions
  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      const playPromise = video.play();
      // Handle browsers that require user gesture
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Play interrupted:', err.message);
        });
      }
    } else {
      video.pause();
    }
  }, [videoRef]);

  const seek = useCallback(
    (time: number) => {
      const video = videoRef.current;
      if (!video) return;
      video.currentTime = Math.max(0, Math.min(time, video.duration || 0));
    },
    [videoRef]
  );

  const seekRelative = useCallback(
    (delta: number) => {
      const video = videoRef.current;
      if (!video) return;
      video.currentTime = Math.max(0, Math.min(video.currentTime + delta, video.duration || 0));
    },
    [videoRef]
  );

  const setVolume = useCallback(
    (vol: number) => {
      const video = videoRef.current;
      if (!video) return;
      video.volume = Math.max(0, Math.min(vol, 1));
      if (vol > 0) video.muted = false;
    },
    [videoRef]
  );

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
  }, [videoRef]);

  const setPlaybackRate = useCallback(
    (rate: number) => {
      const video = videoRef.current;
      if (!video) return;
      video.playbackRate = rate;
      setState((s) => ({ ...s, playbackRate: rate }));
    },
    [videoRef]
  );

  const toggleFullscreen = useCallback(
    (containerRef: React.RefObject<HTMLElement | null>) => {
      if (!document.fullscreenElement) {
        containerRef.current?.requestFullscreen();
        setState((s) => ({ ...s, fullscreen: true }));
      } else {
        document.exitFullscreen();
        setState((s) => ({ ...s, fullscreen: false }));
      }
    },
    []
  );

  return {
    state,
    error,
    togglePlay,
    seek,
    seekRelative,
    setVolume,
    toggleMute,
    setPlaybackRate,
    toggleFullscreen,
  };
}

// ── VideoPlayer Component ──────────────────────────────────────────────

const SPEED_OPTIONS = [0.75, 1, 1.25, 1.5, 2];

export default function VideoPlayer({
  episode,
  season,
  seriesId,
  seriesTitle,
  onNavigateToEpisode,
  className = '',
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [controlsVisible, setControlsVisible] = useState(true);
  const [showNextOverlay, setShowNextOverlay] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [ripple, setRipple] = useState(false);

  const {
    state,
    error,
    togglePlay,
    seek,
    seekRelative,
    setVolume,
    toggleMute,
    setPlaybackRate,
    toggleFullscreen,
  } = useVideoPlayer(videoRef, episode, seriesId);

  const nextEp = useMemo(
    () => getNextEpisode(seriesId, episode.id),
    [seriesId, episode.id]
  );

  // Auto-hide controls
  const showControls = useCallback(() => {
    setControlsVisible(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (state.playing) setControlsVisible(false);
    }, 3000);
  }, [state.playing]);

  useEffect(() => {
    showControls();
  }, [state.playing, showControls]);

  // Skip intro visibility
  const showSkipIntro =
    state.currentTime >= episode.introStart &&
    state.currentTime <= episode.introEnd;

  // Next episode pulse (last 10 seconds)
  const nearEnd =
    state.duration > 0 && state.duration - state.currentTime <= 10 && !showNextOverlay;

  // Auto-trigger next overlay on end
  useEffect(() => {
    if (
      state.duration > 0 &&
      state.currentTime / state.duration >= 0.95 &&
      !state.playing &&
      nextEp &&
      !showNextOverlay
    ) {
      setShowNextOverlay(true);
    }
  }, [state.currentTime, state.duration, state.playing, nextEp, showNextOverlay]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      switch (e.key) {
        case ' ':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          seekRelative(-10);
          break;
        case 'ArrowRight':
          e.preventDefault();
          seekRelative(10);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setVolume(state.volume + 0.1);
          break;
        case 'ArrowDown':
          e.preventDefault();
          setVolume(state.volume - 0.1);
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          toggleFullscreen(containerRef);
          break;
        case 'm':
        case 'M':
          e.preventDefault();
          toggleMute();
          break;
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [togglePlay, seekRelative, setVolume, toggleMute, toggleFullscreen, state.volume]);

  // Fullscreen change listener
  useEffect(() => {
    const onFSChange = () => {
      if (!document.fullscreenElement) {
        // exited fullscreen externally (e.g. Escape)
      }
    };
    document.addEventListener('fullscreenchange', onFSChange);
    return () => document.removeEventListener('fullscreenchange', onFSChange);
  }, []);

  const handlePlayPause = () => {
    togglePlay();
    setRipple(true);
    setTimeout(() => setRipple(false), 400);
  };

  const handleScrubberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    seek(parseFloat(e.target.value));
  };

  const handleNavigateNext = useCallback(() => {
    if (nextEp) {
      onNavigateToEpisode(nextEp.episode.id);
    }
  }, [nextEp, onNavigateToEpisode]);

  const scrubberPercent = state.duration > 0 ? (state.currentTime / state.duration) * 100 : 0;
  const bufferedPercent = state.buffered * 100;

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full bg-black select-none ${className}`}
      onMouseMove={showControls}
      onClick={(e) => {
        // Only toggle play on direct click (not on controls)
        if (e.target === e.currentTarget || (e.target as HTMLElement).tagName === 'VIDEO') {
          handlePlayPause();
        }
      }}
    >
      {/* Video element */}
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        playsInline
        onClick={handlePlayPause}
      />

      {/* Error overlay */}
      {error && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90">
          <div className="text-center px-6 max-w-md">
            <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <p className="text-white font-semibold mb-2">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded-lg text-sm transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Next episode overlay */}
      {showNextOverlay && nextEp && (
        <NextEpisodeOverlay
          nextEpisode={nextEp.episode}
          seasonNumber={nextEp.season.seasonNumber}
          onNavigate={handleNavigateNext}
          onCancel={() => setShowNextOverlay(false)}
        />
      )}

      {/* Controls overlay */}
      <div
        className={`absolute inset-0 flex flex-col justify-between transition-opacity duration-300 ${
          controlsVisible || !state.playing ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Top bar */}
        <div
          className="flex items-center justify-between px-4 py-3 sm:px-6"
          style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.7), transparent)' }}
        >
          <div className="flex-1 min-w-0">
            <p className="text-white/70 text-xs truncate">{seriesTitle}</p>
            <p className="text-white text-sm font-semibold truncate">
              S{season.seasonNumber} E{episode.episodeNumber} &middot; {episode.title}
            </p>
          </div>
          <SkipIntroButton
            visible={showSkipIntro}
            onSkip={() => seek(episode.introEnd)}
          />
        </div>

        {/* Center play/pause button */}
        <div className="flex-1 flex items-center justify-center">
          {(!state.playing || controlsVisible) && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePlayPause();
              }}
              className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/25 transition-all"
            >
              {state.playing ? (
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
              ) : (
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
              {/* Ripple */}
              {ripple && (
                <span className="absolute inset-0 rounded-full border-2 border-white/40 animate-ping" />
              )}
            </button>
          )}
        </div>

        {/* Bottom bar */}
        <div
          className="px-4 pb-3 sm:px-6 sm:pb-4 space-y-2"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Scrubber */}
          <div className="relative h-1.5 group cursor-pointer">
            {/* Buffered range */}
            <div
              className="absolute top-0 left-0 h-full bg-white/20 rounded-full"
              style={{ width: `${bufferedPercent}%` }}
            />
            {/* Progress fill */}
            <div
              className="absolute top-0 left-0 h-full bg-accent rounded-full"
              style={{ width: `${scrubberPercent}%` }}
            />
            {/* Range input (invisible, on top) */}
            <input
              type="range"
              min={0}
              max={state.duration || 1}
              step={0.1}
              value={state.currentTime}
              onChange={handleScrubberChange}
              className="absolute inset-0 w-full opacity-0 cursor-pointer"
              style={{ height: '100%' }}
            />
            {/* Thumb (visible) */}
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
              style={{ left: `calc(${scrubberPercent}% - 7px)` }}
            />
          </div>

          {/* Controls row */}
          <div className="flex items-center gap-3 text-white">
            {/* Play/Pause */}
            <button onClick={handlePlayPause} className="hover:text-accent transition-colors">
              {state.playing ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            {/* Time */}
            <span className="text-xs text-white/70 tabular-nums min-w-[80px]">
              {formatDuration(state.currentTime)} / {formatDuration(state.duration)}
            </span>

            {/* Volume */}
            <div className="flex items-center gap-1.5 group/vol">
              <button onClick={toggleMute} className="hover:text-accent transition-colors">
                {state.muted || state.volume === 0 ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                  </svg>
                )}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={state.muted ? 0 : state.volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-16 sm:w-20 h-1 accent-white opacity-70 group-hover/vol:opacity-100 transition-opacity cursor-pointer"
              />
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Playback speed */}
            <div className="relative">
              <button
                onClick={() => setShowSpeedMenu((v) => !v)}
                className="text-xs font-medium px-2 py-1 rounded bg-white/10 hover:bg-white/20 transition-colors"
              >
                {state.playbackRate}x
              </button>
              {showSpeedMenu && (
                <div className="absolute bottom-full right-0 mb-2 bg-surface border border-border rounded-lg overflow-hidden shadow-xl">
                  {SPEED_OPTIONS.map((rate) => (
                    <button
                      key={rate}
                      onClick={() => {
                        setPlaybackRate(rate);
                        setShowSpeedMenu(false);
                      }}
                      className={`block w-full px-4 py-1.5 text-xs text-left hover:bg-surface-hover transition-colors ${
                        state.playbackRate === rate ? 'text-accent font-semibold' : 'text-white'
                      }`}
                    >
                      {rate}x
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Fullscreen */}
            <button
              onClick={() => toggleFullscreen(containerRef)}
              className="hover:text-accent transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Next Episode button (persistent bottom-right) */}
      {nextEp && !showNextOverlay && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowNextOverlay(true);
          }}
          className={`absolute bottom-16 right-4 sm:bottom-20 sm:right-6 z-30 px-3 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs font-medium hover:bg-white/20 transition-all ${
            nearEnd ? 'animate-pulse ring-2 ring-accent/50' : ''
          }`}
        >
          Next Episode &rarr;
        </button>
      )}
    </div>
  );
}
