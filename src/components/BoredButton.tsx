'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const MOODS = [
  { key: 'action',    label: '🚀 Action',       desc: 'Explosions & thrills' },
  { key: 'comedy',    label: '😂 Comedy',        desc: 'Laugh out loud' },
  { key: 'horror',    label: '😱 Horror',        desc: 'Can\'t look away' },
  { key: 'romance',   label: '💝 Romance',       desc: 'Feel the love' },
  { key: 'scifi',     label: '🌌 Sci-Fi',        desc: 'Mind the future' },
  { key: 'mystery',   label: '🧠 Mystery',       desc: 'Twist your brain' },
  { key: 'drama',     label: '🎭 Drama',         desc: 'Deep stories' },
  { key: 'adventure', label: '🏔️ Adventure',    desc: 'Explore the world' },
];

export default function BoredButton() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleMood = async (mood: string) => {
    setLoading(mood);
    try {
      const res = await fetch(`/api/random-movie?mood=${mood}`);
      const data = await res.json();
      if (data.slug) {
        router.push(`/movie/${data.slug}`);
        setOpen(false);
      }
    } catch {
      // ignore
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 px-6 py-3 bg-surface hover:bg-surface-hover border border-border text-white font-semibold rounded-lg transition-colors"
      >
        <span className="text-lg">🎲</span>
        I&apos;m Bored
      </button>

      {open && (
        <div className="absolute bottom-full mb-2 left-0 z-50 w-72 bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-2xl overflow-hidden">
          <div className="p-3 border-b border-[var(--border)]">
            <p className="text-sm font-semibold text-white">Pick a mood</p>
            <p className="text-xs text-muted mt-0.5">We&apos;ll find you something to watch</p>
          </div>
          <div className="grid grid-cols-2 gap-1 p-2">
            {MOODS.map((mood) => (
              <button
                key={mood.key}
                onClick={() => handleMood(mood.key)}
                disabled={loading !== null}
                className="flex flex-col items-start p-3 rounded-lg hover:bg-[var(--surface-hover)] transition-colors text-left disabled:opacity-50"
              >
                {loading === mood.key ? (
                  <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin mb-1" />
                ) : (
                  <span className="text-lg mb-1">{mood.label.split(' ')[0]}</span>
                )}
                <span className="text-sm text-white font-medium">{mood.label.split(' ').slice(1).join(' ')}</span>
                <span className="text-xs text-muted">{mood.desc}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
