// ── StarsBackground Component ──
// Decorative twinkling stars for dark mode ambiance

import React, { useMemo } from 'react';

interface Star {
  id: number;
  left: string;
  top: string;
  size: string;
  duration: string;
  delay: string;
}

interface Props {
  isDark: boolean;
}

export const StarsBackground: React.FC<Props> = ({ isDark }) => {
  const stars = useMemo<Star[]>(() =>
    Array.from({ length: 60 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: `${Math.random() * 2.5 + 1}px`,
      duration: `${Math.random() * 4 + 2}s`,
      delay: `${Math.random() * 5}s`,
    })),
  []);

  if (!isDark) return null;

  return (
    <div className="stars-container" aria-hidden="true">
      {stars.map((star) => (
        <div
          key={star.id}
          className="star"
          style={{
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
            animationDuration: star.duration,
            animationDelay: star.delay,
          }}
        />
      ))}
    </div>
  );
};
