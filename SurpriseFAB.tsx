// ── SurpriseFAB Component ──
// Floating Action Button that triggers random surprise animations

import React, { useState, useCallback } from 'react';
import confetti from 'canvas-confetti';

const SURPRISES = [
  // Fireworks
  () => {
    const duration = 3000;
    const end = Date.now() + duration;
    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#e91e8c', '#9b27af', '#ffd93d'],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#ff6b6b', '#6bcb77', '#4ecdc4'],
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  },
  // Confetti burst from center
  () => {
    confetti({
      particleCount: 200,
      spread: 160,
      origin: { y: 0.4 },
      colors: ['#e91e8c', '#9b27af', '#ff6b6b', '#ffd93d', '#6bcb77', '#4ecdc4', '#fff'],
      scalar: 1.2,
    });
  },
  // Stars rain
  () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0 },
      shapes: ['star'],
      colors: ['#ffd93d', '#ff6b6b', '#e91e8c', '#fff', '#c77dff'],
      gravity: 0.6,
      scalar: 1.5,
      drift: 0.5,
    });
  },
  // Side blasters
  () => {
    [0.1, 0.3, 0.5, 0.7, 0.9].forEach((x, i) => {
      setTimeout(() => {
        confetti({
          particleCount: 30,
          angle: 90,
          spread: 50,
          origin: { x, y: 1 },
          colors: ['#e91e8c', '#9b27af', '#ffd93d', '#ff6b6b'],
          startVelocity: 55,
        });
      }, i * 200);
    });
  },
  // Ticker tape
  () => {
    confetti({
      particleCount: 300,
      startVelocity: 0,
      spread: 360,
      origin: { x: 0.5, y: 0.2 },
      colors: ['#e91e8c', '#9b27af', '#ffd93d', '#ff6b6b', '#6bcb77', '#fff', '#4ecdc4'],
      gravity: 0.3,
      drift: 0,
      ticks: 400,
    });
  },
];

const EMOJIS = ['🎉', '🎊', '✨', '🥳', '🌟', '🎈', '🦋', '🎆'];

interface Props {
  onSurprise: () => void;
}

export const SurpriseFAB: React.FC<Props> = ({ onSurprise }) => {
  const [emoji, setEmoji] = useState('🎉');
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);

    // Random emoji
    const randomEmoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
    setEmoji(randomEmoji);

    // Random surprise effect
    const randomSurprise = SURPRISES[Math.floor(Math.random() * SURPRISES.length)];
    randomSurprise();

    // Notify parent for any additional effects
    onSurprise();

    setTimeout(() => {
      setIsAnimating(false);
      setEmoji('🎉');
    }, 2500);
  }, [isAnimating, onSurprise]);

  return (
    <button
      className="surprise-fab"
      onClick={handleClick}
      aria-label="Surprise me with a random celebration effect"
      title="Surprise Me!"
      style={{
        transform: isAnimating ? 'scale(1.2) rotate(360deg)' : '',
        transition: isAnimating ? 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)' : '',
      }}
    >
      <span
        style={{
          display: 'inline-block',
          animation: isAnimating ? 'heartbeat 0.4s ease-in-out infinite' : 'none',
          fontSize: '1.4rem',
        }}
        aria-hidden="true"
      >
        {emoji}
      </span>
      <span className="surprise-fab__tooltip">✨ Surprise Me!</span>
    </button>
  );
};
