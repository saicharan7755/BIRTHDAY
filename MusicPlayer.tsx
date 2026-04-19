// ── MusicPlayer Component ──
// Floating music player with Web Audio API generated birthday tune
// (No external audio files required)

import React, { useState, useRef, useCallback, useEffect } from 'react';

interface MusicPlayerProps {
  isOpen: boolean;
  onClose: () => void;
}

// Happy Birthday melody: [frequency in Hz, duration in seconds]
const HAPPY_BIRTHDAY_MELODY: [number, number][] = [
  [264, 0.25], [264, 0.125], [297, 0.375], [264, 0.375], [352, 0.375], [330, 0.75],
  [264, 0.25], [264, 0.125], [297, 0.375], [264, 0.375], [396, 0.375], [352, 0.75],
  [264, 0.25], [264, 0.125], [528, 0.375], [440, 0.375], [352, 0.375], [330, 0.375], [297, 0.75],
  [466, 0.25], [466, 0.125], [440, 0.375], [352, 0.375], [396, 0.375], [352, 0.75],
];

// Secondary melody for looping
const BIRTHDAY_CHORDS: [number[], number][] = [
  [[264, 330, 396], 0.5],
  [[264, 330, 396], 0.5],
  [[297, 374, 440], 1.0],
  [[264, 330, 396], 0.5],
  [[352, 440, 528], 0.5],
  [[330, 415, 495], 1.5],
];

const TRACKS = [
  { title: 'Happy Birthday Melody', artist: 'Special For You 🎶', emoji: '🎂' },
  { title: 'Celebration Vibes', artist: 'Birthday Mix 🥳', emoji: '🎊' },
  { title: 'Birthday Serenade', artist: 'With Love ❤️', emoji: '🎵' },
];

export const MusicPlayer: React.FC<MusicPlayerProps> = ({ isOpen, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration] = useState(30);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef(0);
  const noteTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Init AudioContext
  const getAudioCtx = useCallback(() => {
    if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const gainNode = ctx.createGain();
      gainNode.gain.value = volume;
      gainNode.connect(ctx.destination);
      audioCtxRef.current = ctx;
      gainNodeRef.current = gainNode;
    }
    return { ctx: audioCtxRef.current, gain: gainNodeRef.current! };
  }, [volume]);

  // Play a single note
  const playNote = useCallback((ctx: AudioContext, gain: GainNode, freq: number, startT: number, dur: number) => {
    const osc = ctx.createOscillator();
    const noteGain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    osc.connect(noteGain);
    noteGain.connect(gain);

    noteGain.gain.setValueAtTime(0, startT);
    noteGain.gain.linearRampToValueAtTime(0.4, startT + 0.02);
    noteGain.gain.exponentialRampToValueAtTime(0.001, startT + dur - 0.02);

    osc.start(startT);
    osc.stop(startT + dur);
    return osc;
  }, []);

  // Play the melody
  const startMelody = useCallback(() => {
    const { ctx, gain } = getAudioCtx();
    if (ctx.state === 'suspended') ctx.resume();

    const melody = trackIndex === 0 ? HAPPY_BIRTHDAY_MELODY : BIRTHDAY_CHORDS.flatMap(([freqs, dur]) =>
      (freqs as number[]).map((f) => [f, dur] as [number, number])
    );

    let time = ctx.currentTime + 0.1;
    const oscs: OscillatorNode[] = [];

    melody.forEach(([freq, dur]) => {
      oscs.push(playNote(ctx, gain, freq as number, time, dur as number));
      time += (dur as number) + 0.02;
    });

    oscillatorsRef.current = oscs;
    startTimeRef.current = ctx.currentTime;

    // Restart when done
    noteTimeoutRef.current = setTimeout(() => {
      if (isPlaying) startMelody();
    }, (time - ctx.currentTime) * 1000 + 200);
  }, [getAudioCtx, playNote, trackIndex, isPlaying]);

  // Stop all sounds
  const stopAll = useCallback(() => {
    if (noteTimeoutRef.current) clearTimeout(noteTimeoutRef.current);
    oscillatorsRef.current.forEach((osc) => {
      try { osc.stop(); } catch { /* ignore */ }
    });
    oscillatorsRef.current = [];
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
  }, []);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      stopAll();
      setIsPlaying(false);
    } else {
      startMelody();
      setIsPlaying(true);
      // Progress animation
      const interval = setInterval(() => {
        setCurrentTime((t) => {
          const next = (t + 0.5) % duration;
          setProgress((next / duration) * 100);
          return next;
        });
      }, 500);
      progressIntervalRef.current = interval;
    }
  }, [isPlaying, startMelody, stopAll, duration]);

  const changeTrack = useCallback((dir: 1 | -1) => {
    stopAll();
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime(0);
    setTrackIndex((i) => (i + dir + TRACKS.length) % TRACKS.length);
  }, [stopAll]);

  // Volume update
  useEffect(() => {
    if (gainNodeRef.current) gainNodeRef.current.gain.value = volume;
  }, [volume]);

  // Cleanup on unmount
  useEffect(() => () => stopAll(), [stopAll]);

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

  const currentTrack = TRACKS[trackIndex];

  return (
    <div className={`music-player glass-card ${isOpen ? 'open' : ''}`} role="region" aria-label="Music player">
      {/* Header */}
      <div className="music-player__header">
        <div className={`music-player__disc ${isPlaying ? 'playing' : ''}`} aria-hidden="true">
          {currentTrack.emoji}
        </div>
        <div className="music-player__info">
          <p className="music-player__title">{currentTrack.title}</p>
          <p className="music-player__artist">{currentTrack.artist}</p>
        </div>
        <button
          className="player-btn"
          onClick={onClose}
          aria-label="Close player"
          style={{ fontSize: '0.8rem' }}
        >
          ✕
        </button>
      </div>

      {/* Controls */}
      <div className="music-player__controls">
        <button className="player-btn" onClick={() => changeTrack(-1)} aria-label="Previous track">
          ⏮
        </button>
        <button
          className="player-btn player-btn--main"
          onClick={togglePlay}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>
        <button className="player-btn" onClick={() => changeTrack(1)} aria-label="Next track">
          ⏭
        </button>
      </div>

      {/* Progress */}
      <div className="music-progress">
        <div
          className="progress-bar-container"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="progress-times">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Volume */}
      <div className="music-volume">
        <span className="volume-icon">{volume === 0 ? '🔇' : volume < 0.5 ? '🔉' : '🔊'}</span>
        <input
          type="range"
          className="volume-slider"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          aria-label="Volume control"
        />
      </div>

      {/* Note about audio */}
      <p style={{
        fontSize: '0.68rem',
        color: 'var(--text-muted)',
        textAlign: 'center',
        marginTop: '0.75rem',
        lineHeight: 1.4
      }}>
        🎹 Synthesized birthday melody — no audio files needed!
      </p>
    </div>
  );
};
