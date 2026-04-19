// ── CakeSection Component ──
// Interactive SVG birthday cake — click to blow out candles with animation

import React, { useState, useRef, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';

interface Candle {
  id: number;
  x: number;
  blown: boolean;
}

const CANDLES_DATA: Candle[] = [
  { id: 1, x: 90,  blown: false },
  { id: 2, x: 130, blown: false },
  { id: 3, x: 170, blown: false },
  { id: 4, x: 210, blown: false },
  { id: 5, x: 250, blown: false },
];

const MESSAGES = [
  'Click a candle to blow it out! 🌬️',
  'One down, keep going! 💨',
  'Getting closer... 🎂',
  'Almost there! 🌟',
  'One more! You can do it! ✨',
  '🎉 All candles blown! Make a wish! 🌠',
];

const BirthdayCakeSVG: React.FC<{
  candles: Candle[];
  onCandleClick: (id: number) => void;
}> = ({ candles, onCandleClick }) => (
  <svg
    viewBox="0 0 340 320"
    width="340"
    height="320"
    aria-label="Interactive birthday cake"
    role="img"
  >
    {/* === PLATE === */}
    <ellipse cx="170" cy="290" rx="135" ry="14" fill="#e8d5f5" opacity="0.5" />

    {/* === BOTTOM TIER === */}
    <rect x="40" y="220" width="260" height="70" rx="12" fill="#F48FB1" />
    <rect x="40" y="220" width="260" height="20" rx="8" fill="#F06292" />
    {/* Bottom tier decorations */}
    <circle cx="80" cy="255" r="8" fill="#fff" opacity="0.6" />
    <circle cx="120" cy="255" r="8" fill="#fff" opacity="0.6" />
    <circle cx="160" cy="255" r="8" fill="#fff" opacity="0.6" />
    <circle cx="200" cy="255" r="8" fill="#fff" opacity="0.6" />
    <circle cx="240" cy="255" r="8" fill="#fff" opacity="0.6" />
    <circle cx="280" cy="255" r="8" fill="#fff" opacity="0.6" />
    {/* Scallop border */}
    {[60,90,120,150,180,210,240,270,300].map((x) => (
      <circle key={x} cx={x} cy="289" r="6" fill="#F48FB1" />
    ))}

    {/* === MIDDLE TIER === */}
    <rect x="65" y="155" width="210" height="68" rx="10" fill="#CE93D8" />
    <rect x="65" y="155" width="210" height="18" rx="8" fill="#BA68C8" />
    {/* Dots */}
    <circle cx="105" cy="190" r="7" fill="#fff" opacity="0.5" />
    <circle cx="145" cy="190" r="7" fill="#fff" opacity="0.5" />
    <circle cx="185" cy="190" r="7" fill="#fff" opacity="0.5" />
    <circle cx="225" cy="190" r="7" fill="#fff" opacity="0.5" />
    {/* Scallop border */}
    {[85,115,145,175,205,235,255].map((x) => (
      <circle key={x} cx={x} cy="222" r="5" fill="#CE93D8" />
    ))}

    {/* === TOP TIER === */}
    <rect x="95" y="100" width="150" height="58" rx="10" fill="#F8BBD0" />
    <rect x="95" y="100" width="150" height="16" rx="8" fill="#F48FB1" />
    {/* Stars */}
    <text x="120" y="133" fontSize="14" textAnchor="middle">⭐</text>
    <text x="170" y="133" fontSize="14" textAnchor="middle">⭐</text>
    <text x="220" y="133" fontSize="14" textAnchor="middle">⭐</text>
    {/* Scallop border */}
    {[110,140,170,200,230].map((x) => (
      <circle key={x} cx={x} cy="157" r="5" fill="#F8BBD0" />
    ))}

    {/* Frosting drips */}
    {[100,125,155,185,210,235].map((x, i) => (
      <path
        key={i}
        d={`M${x},100 Q${x + 8},110 ${x + 5},118`}
        stroke="#fff"
        strokeWidth="4"
        fill="none"
        opacity="0.7"
        strokeLinecap="round"
      />
    ))}

    {/* === CANDLES === */}
    {candles.map((c) => (
      <g
        key={c.id}
        className="candle"
        onClick={() => !c.blown && onCandleClick(c.id)}
        style={{ cursor: c.blown ? 'default' : 'pointer' }}
        aria-label={c.blown ? `Candle ${c.id} blown out` : `Blow out candle ${c.id}`}
        role={c.blown ? undefined : 'button'}
      >
        {/* Candle body */}
        <rect
          x={c.x - 6}
          y={58}
          width={12}
          height={44}
          rx={4}
          fill={c.blown ? '#aaa' : ['#FF6B6B','#FFD93D','#6BCB77','#4ECDC4','#FF9A9E'][c.id - 1]}
        />
        {/* Stripe */}
        <rect
          x={c.x - 6}
          y={70}
          width={12}
          height={4}
          rx={1}
          fill="rgba(255,255,255,0.4)"
        />

        {/* Wick */}
        <line
          x1={c.x}
          y1={58}
          x2={c.x}
          y2={52}
          stroke={c.blown ? '#888' : '#555'}
          strokeWidth={1.5}
          strokeLinecap="round"
        />

        {/* Flame */}
        {!c.blown ? (
          <g className="candle-flame">
            {/* Outer glow */}
            <ellipse cx={c.x} cy={44} rx={9} ry={11} fill="rgba(255,200,50,0.2)" />
            {/* Main flame */}
            <path
              d={`M${c.x},52 C${c.x - 5},46 ${c.x - 6},38 ${c.x},34 C${c.x + 6},38 ${c.x + 5},46 ${c.x},52z`}
              fill="url(#flameGrad)"
            />
            {/* Inner flame */}
            <path
              d={`M${c.x},50 C${c.x - 2},46 ${c.x - 2},42 ${c.x},39 C${c.x + 2},42 ${c.x + 2},46 ${c.x},50z`}
              fill="#fff5c0"
              opacity="0.8"
            />
          </g>
        ) : (
          /* Smoke puff */
          <g className="candle-smoke active">
            <circle cx={c.x} cy={44} r={4} fill="#999" opacity={0.3} />
            <circle cx={c.x + 2} cy={38} r={3} fill="#aaa" opacity={0.2} />
            <circle cx={c.x - 1} cy={33} r={2} fill="#bbb" opacity={0.1} />
          </g>
        )}
      </g>
    ))}

    {/* === DEFS === */}
    <defs>
      <radialGradient id="flameGrad" cx="50%" cy="70%" r="50%">
        <stop offset="0%" stopColor="#fff700" />
        <stop offset="40%" stopColor="#ff8c00" />
        <stop offset="100%" stopColor="#ff4000" stopOpacity="0.8" />
      </radialGradient>
    </defs>
  </svg>
);

export const CakeSection: React.FC = () => {
  const [candles, setCandles] = useState<Candle[]>(CANDLES_DATA);
  const [message, setMessage] = useState(MESSAGES[0]);
  const [isWobbling, setIsWobbling] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const blownCount = candles.filter((c) => c.blown).length;
  const allBlown = blownCount === candles.length;

  // Scroll reveal
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) el.classList.add('visible'); },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const blowCandle = useCallback((id: number) => {
    setCandles((prev) => prev.map((c) => (c.id === id ? { ...c, blown: true } : c)));
    setIsWobbling(true);
    setTimeout(() => setIsWobbling(false), 500);

    const newBlown = blownCount + 1;
    setMessage(MESSAGES[Math.min(newBlown, MESSAGES.length - 1)]);

    // Play a small confetti burst on each candle
    confetti({
      particleCount: 20,
      spread: 40,
      origin: { y: 0.6 },
      colors: ['#e91e8c', '#ffd93d', '#9b27af', '#6bcb77'],
      scalar: 0.7,
    });

    // Big confetti if all blown
    if (newBlown === candles.length) {
      setTimeout(() => {
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.5 },
          colors: ['#e91e8c', '#ffd93d', '#9b27af', '#ff6b6b', '#6bcb77'],
        });
        // Side cannons
        confetti({ angle: 60, spread: 80, particleCount: 80, origin: { x: 0, y: 0.6 } });
        confetti({ angle: 120, spread: 80, particleCount: 80, origin: { x: 1, y: 0.6 } });
      }, 300);
    }
  }, [blownCount, candles.length]);

  const resetCandles = () => {
    setCandles(CANDLES_DATA.map((c) => ({ ...c, blown: false })));
    setMessage(MESSAGES[0]);
  };

  return (
    <section
      className="cake-section reveal"
      id="cake"
      ref={sectionRef as React.RefObject<HTMLElement>}
      aria-label="Interactive birthday cake"
    >
      <div className="section-container">
        <h2 className="section-title">Make a Wish! 🕯️</h2>
        <p className="section-subtitle">Click each candle to blow it out and make your wishes come true</p>

        <div className="cake-wrapper">
          {/* Cake SVG */}
          <div
            className={`cake-svg-container ${isWobbling ? 'wobbling' : ''}`}
            style={{ animation: isWobbling ? 'cake-wobble 0.5s ease' : 'none' }}
          >
            <BirthdayCakeSVG candles={candles} onCandleClick={blowCandle} />

            {/* Glow effect underneath */}
            {!allBlown && <div className="cake-glow" aria-hidden="true" />}
          </div>

          {/* Progress indicator */}
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
            {candles.map((c) => (
              <div
                key={c.id}
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: c.blown
                    ? 'var(--text-muted)'
                    : `linear-gradient(135deg, ${['#FF6B6B','#FFD93D','#6BCB77','#4ECDC4','#FF9A9E'][c.id - 1]}, #fff)`,
                  transition: 'all 0.3s ease',
                  boxShadow: c.blown ? 'none' : `0 0 8px ${['#FF6B6B','#FFD93D','#6BCB77','#4ECDC4','#FF9A9E'][c.id - 1]}`,
                }}
              />
            ))}
          </div>

          {/* Dynamic message */}
          <p className="cake-message">{message}</p>

          {/* Reset button (shows after all blown) */}
          {allBlown && (
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <button className="btn-primary" onClick={resetCandles}>
                🕯️ Light Candles Again
              </button>
              <div
                className="glass-card"
                style={{ padding: '0.75rem 1.5rem', fontFamily: "'Dancing Script', cursive", fontSize: '1.2rem', color: 'var(--accent-1)' }}
              >
                🌠 Your wish has been sent to the stars!
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
