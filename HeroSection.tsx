// ── HeroSection Component ──
// Full-screen hero with typing animation, floating emojis, and gradient background

import React, { useEffect, useState, useRef } from 'react';
import { useTypewriter } from '../hooks/useTypewriter';

interface HeroSectionProps {
  onCelebrate: () => void;
}

const FLOATING_EMOJIS = [
  '🎉', '🎊', '🎈', '🌟', '💖', '🎁', '✨', '🦋',
  '🌸', '🎂', '🥳', '💫', '🌈', '🍭', '🎀',
];

interface FloatingEmoji {
  id: number;
  emoji: string;
  left: string;
  duration: string;
  delay: string;
  size: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onCelebrate }) => {
  const [emojis, setEmojis] = useState<FloatingEmoji[]>([]);
  const initialized = useRef(false);

  // Typing animation for subtitle messages
  const { displayText } = useTypewriter(
    [
      'Wishing you a day as wonderful as you are ✨',
      'May all your dreams come true today 🌟',
      'Another year of amazing adventures awaits 🎊',
      'You deserve all the happiness in the world 💖',
    ],
    { speed: 60, loop: true, deleteSpeed: 30 }
  );

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // Create floating emojis with random positions
    const generated: FloatingEmoji[] = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      emoji: FLOATING_EMOJIS[i % FLOATING_EMOJIS.length],
      left: `${Math.random() * 90 + 5}%`,
      duration: `${Math.random() * 10 + 12}s`,
      delay: `${Math.random() * 8}s`,
      size: `${Math.random() * 1.2 + 1.2}rem`,
    }));

    setEmojis(generated);
  }, []);

  const scrollToMessage = () => {
    document.getElementById('message')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="hero" id="hero" aria-label="Hero section">
      {/* Animated gradient background */}
      <div className="hero__bg">
        <div className="hero__bg-orb" />
        <div className="hero__bg-orb" />
        <div className="hero__bg-orb" />
      </div>

      {/* Floating emojis */}
      <div className="hero__emoji-ring" aria-hidden="true">
        {emojis.map((item) => (
          <span
            key={item.id}
            className="floating-emoji"
            style={{
              left: item.left,
              animationDuration: item.duration,
              animationDelay: item.delay,
              fontSize: item.size,
            }}
          >
            {item.emoji}
          </span>
        ))}
      </div>

      {/* Badge */}
      <div className="hero__badge">
        <span>🎂</span>
        <span>Today is the most special day of the year</span>
      </div>

      {/* Main Title */}
      <h1 className="hero__title">
        <span className="gradient-text">Happy Birthday</span>
        <span className="hero__name">Alexandra ✨</span>
      </h1>

      {/* Animated Subtitle */}
      <p className="hero__subtitle" aria-live="polite">
        {displayText}
        <span className="typing-cursor" aria-hidden="true" />
      </p>

      {/* CTA Buttons */}
      <div className="hero__actions">
        <button className="btn-primary" onClick={onCelebrate}>
          🎊 Celebrate Now!
        </button>
        <button className="btn-secondary" onClick={scrollToMessage}
          style={{ color: 'rgba(255,255,255,0.9)', borderColor: 'rgba(255,255,255,0.5)' }}>
          💌 Read My Message
        </button>
      </div>

      {/* Scroll hint */}
      <div className="hero__scroll-hint" aria-hidden="true">
        <div className="scroll-arrow" />
        <span>Scroll to explore</span>
      </div>
    </section>
  );
};
