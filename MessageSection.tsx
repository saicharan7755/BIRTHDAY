// ── MessageSection Component ──
// Heartfelt birthday message with typewriter reveal effect

import React, { useEffect, useRef, useState } from 'react';

const FULL_MESSAGE = `On this beautiful day that marks another year of your incredible journey,
I want you to know just how much you mean to the world around you.
Your laughter lights up every room, your kindness touches every heart,
and your spirit inspires everyone who is lucky enough to know you.

You have grown into someone truly extraordinary — someone who faces challenges
with grace, loves without conditions, and dreams without limits. Every year,
you become more remarkable than the last, and I can't wait to see where this
new chapter takes you.

May this birthday bring you everything your heart desires: endless joy,
beautiful surprises, cherished moments with loved ones, and the quiet
knowing that you are deeply, unconditionally loved. Here's to you —
to your past that made you strong, your present that makes you shine,
and your future that will make you legendary.`;

export const MessageSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [charIndex, setCharIndex] = useState(0);

  // Scroll reveal trigger
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          obs.unobserve(el);
        }
      },
      { threshold: 0.25 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Typewriter effect starts when visible
  useEffect(() => {
    if (!isVisible) return;
    if (charIndex >= FULL_MESSAGE.length) return;

    const timeout = setTimeout(() => {
      setDisplayedText(FULL_MESSAGE.slice(0, charIndex + 1));
      setCharIndex((i) => i + 1);
    }, 20); // Fast typewriter speed

    return () => clearTimeout(timeout);
  }, [isVisible, charIndex]);

  return (
    <section
      className="message-section reveal"
      id="message"
      ref={sectionRef as React.RefObject<HTMLElement>}
      aria-label="Birthday message"
    >
      <div className="section-container">
        <h2 className="section-title">A Message From the Heart 💌</h2>
        <p className="section-subtitle">Written especially for you, with all the love in the world</p>

        <div className="message-card glass-card">
          {/* Opening icon */}
          <span className="message-icon" aria-hidden="true">💝</span>

          {/* Animated message text */}
          <p className="message-text" aria-live="polite">
            {isVisible ? displayedText : ''}
            {isVisible && charIndex < FULL_MESSAGE.length && (
              <span className="typing-cursor" aria-hidden="true" />
            )}
          </p>

          {/* Signature */}
          {charIndex >= FULL_MESSAGE.length && (
            <div
              className="message-signature"
              style={{ animation: 'fade-up 0.8s ease forwards', opacity: 0, animationFillMode: 'forwards' }}
            >
              — With all my love 🌹
            </div>
          )}
        </div>

        {/* Quote cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1rem',
            marginTop: '2rem',
          }}
        >
          {[
            { emoji: '🌟', text: '"You are braver than you believe, stronger than you seem."' },
            { emoji: '🌸', text: '"The most beautiful things in life are felt with the heart."' },
            { emoji: '✨', text: '"She believed she could, so she did."' },
          ].map((q) => (
            <div
              key={q.emoji}
              className="glass-card"
              style={{
                padding: '1.5rem',
                textAlign: 'center',
                animation: charIndex >= FULL_MESSAGE.length ? 'scale-in 0.5s ease forwards' : 'none',
              }}
            >
              <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.75rem' }}>
                {q.emoji}
              </span>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontStyle: 'italic', lineHeight: 1.7 }}>
                {q.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
