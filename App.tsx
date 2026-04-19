/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║           Happy Birthday Website — Main App                  ║
 * ║   A fully-featured, production-ready celebration website     ║
 * ║   Built with React, TypeScript, and Tailwind CSS             ║
 * ╚══════════════════════════════════════════════════════════════╝
 *
 * Sections:
 *   1. HeroSection       – Animated hero with typewriter effect
 *   2. CountdownSection  – Age counter + next birthday countdown
 *   3. MessageSection    – Heartfelt message with typewriter reveal
 *   4. GallerySection    – Photo grid with lightbox
 *   5. CakeSection       – Interactive SVG cake with candle blowing
 *   6. TimelineSection   – Memory timeline with scroll animations
 *   7. WishesSection     – Guest wish wall (persisted in localStorage)
 *   8. MusicPlayer       – Web Audio API synthesized birthday melody
 *   9. SurpriseFAB       – Random confetti celebration effects
 */

import { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';

// Components
import { Navbar } from './components/Navbar';
import { ParticleBackground } from './components/ParticleBackground';
import { StarsBackground } from './components/StarsBackground';
import { HeroSection } from './components/HeroSection';
import { CountdownSection } from './components/CountdownSection';
import { MessageSection } from './components/MessageSection';
import { GallerySection } from './components/GallerySection';
import { CakeSection } from './components/CakeSection';
import { TimelineSection } from './components/TimelineSection';
import { WishesSection } from './components/WishesSection';
import { MusicPlayer } from './components/MusicPlayer';
import { SurpriseFAB } from './components/SurpriseFAB';
import { Footer } from './components/Footer';

const THEME_KEY = 'hbd_theme';

function App() {
  // ── Theme State ──
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // ── Music Player State ──
  const [isMusicOpen, setIsMusicOpen] = useState(false);

  // ── Apply theme to document ──
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
  }, [isDark]);

  // ── Launch confetti on initial page load ──
  useEffect(() => {
    const timer = setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.3 },
        colors: ['#e91e8c', '#9b27af', '#ffd93d', '#ff6b6b', '#6bcb77'],
      });
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleThemeToggle = useCallback(() => setIsDark((d) => !d), []);

  const handleCelebrate = useCallback(() => {
    // Multi-burst celebration
    const duration = 2500;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: ['#e91e8c', '#9b27af', '#ffd93d'],
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: ['#ff6b6b', '#6bcb77', '#fff'],
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    };

    frame();
  }, []);

  const handleSurprise = useCallback(() => {
    // Any additional surprise behavior can go here
    // (The FAB handles its own confetti effects)
  }, []);

  return (
    <>
      {/* ── Fixed Background Elements ── */}
      <ParticleBackground isDark={isDark} />
      <StarsBackground isDark={isDark} />

      {/* ── Floating Navigation ── */}
      <Navbar
        isDark={isDark}
        onThemeToggle={handleThemeToggle}
        isMusicOpen={isMusicOpen}
        onMusicToggle={() => setIsMusicOpen((o) => !o)}
      />

      {/* ── Main Content ── */}
      <main id="main-content">
        {/* 1. Hero */}
        <HeroSection onCelebrate={handleCelebrate} />

        {/* Divider */}
        <div style={{ height: '1px', background: 'var(--border-color)', margin: '0 2rem' }} />

        {/* 2. Countdown */}
        <CountdownSection />

        {/* Divider */}
        <div style={{ height: '1px', background: 'var(--border-color)', margin: '0 2rem' }} />

        {/* 3. Personalized Message */}
        <MessageSection />

        {/* Divider */}
        <div style={{ height: '1px', background: 'var(--border-color)', margin: '0 2rem' }} />

        {/* 4. Photo Gallery */}
        <GallerySection />

        {/* Divider */}
        <div style={{ height: '1px', background: 'var(--border-color)', margin: '0 2rem' }} />

        {/* 5. Interactive Cake */}
        <CakeSection />

        {/* Divider */}
        <div style={{ height: '1px', background: 'var(--border-color)', margin: '0 2rem' }} />

        {/* 6. Memory Timeline */}
        <TimelineSection />

        {/* Divider */}
        <div style={{ height: '1px', background: 'var(--border-color)', margin: '0 2rem' }} />

        {/* 7. Guest Wishes */}
        <WishesSection />
      </main>

      {/* ── Footer ── */}
      <Footer />

      {/* ── Floating Music Player ── */}
      <MusicPlayer
        isOpen={isMusicOpen}
        onClose={() => setIsMusicOpen(false)}
      />

      {/* ── Surprise FAB ── */}
      <SurpriseFAB onSurprise={handleSurprise} />
    </>
  );
}

export default App;
