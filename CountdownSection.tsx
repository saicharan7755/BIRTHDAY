// ── CountdownSection Component ──
// Counts up from birth date OR down to next birthday

import React, { useState, useEffect, useRef } from 'react';

// ── Set the birthday date here ──
const BIRTHDAY = new Date('1999-07-15T00:00:00');

interface TimeUnit {
  value: number;
  label: string;
}

function getAge(birthday: Date): { years: number; months: number; days: number; hours: number } {
  const now = new Date();
  let years = now.getFullYear() - birthday.getFullYear();
  let months = now.getMonth() - birthday.getMonth();
  let days = now.getDate() - birthday.getDate();
  let hours = now.getHours() - birthday.getHours();

  if (hours < 0) { hours += 24; days--; }
  if (days < 0) {
    months--;
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) { months += 12; years--; }

  return { years, months, days, hours };
}

function getNextBirthdayCountdown(birthday: Date): { days: number; hours: number; minutes: number; seconds: number } {
  const now = new Date();
  const next = new Date(now.getFullYear(), birthday.getMonth(), birthday.getDate());
  if (next <= now) next.setFullYear(now.getFullYear() + 1);

  const diff = next.getTime() - now.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds };
}

function isTodayBirthday(birthday: Date): boolean {
  const now = new Date();
  return now.getMonth() === birthday.getMonth() && now.getDate() === birthday.getDate();
}

interface AnimatedNumberProps {
  value: number;
}

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({ value }) => {
  const [displayValue, setDisplayValue] = useState(value);
  const prevRef = useRef(value);

  useEffect(() => {
    if (prevRef.current !== value) {
      prevRef.current = value;
      setDisplayValue(value);
    }
  }, [value]);

  return (
    <span className="countdown-number">
      {String(displayValue).padStart(2, '0')}
    </span>
  );
};

export const CountdownSection: React.FC = () => {
  const [mode, setMode] = useState<'age' | 'countdown'>('age');
  const [age, setAge] = useState(getAge(BIRTHDAY));
  const [countdown, setCountdown] = useState(getNextBirthdayCountdown(BIRTHDAY));
  const sectionRef = useRef<HTMLElement>(null);
  const isToday = isTodayBirthday(BIRTHDAY);

  useEffect(() => {
    const interval = setInterval(() => {
      setAge(getAge(BIRTHDAY));
      setCountdown(getNextBirthdayCountdown(BIRTHDAY));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

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

  const ageUnits: TimeUnit[] = [
    { value: age.years, label: 'Years' },
    { value: age.months, label: 'Months' },
    { value: age.days, label: 'Days' },
    { value: age.hours, label: 'Hours' },
  ];

  const countdownUnits: TimeUnit[] = [
    { value: countdown.days, label: 'Days' },
    { value: countdown.hours, label: 'Hours' },
    { value: countdown.minutes, label: 'Minutes' },
    { value: countdown.seconds, label: 'Seconds' },
  ];

  const units = mode === 'age' ? ageUnits : countdownUnits;

  return (
    <section
      className="countdown-section reveal"
      id="countdown"
      ref={sectionRef as React.RefObject<HTMLElement>}
      aria-label="Birthday countdown"
    >
      <div className="section-container">
        <h2 className="section-title">
          {isToday ? '🎉 It\'s Your Day!' : mode === 'age' ? '⏳ Life So Far' : '⏰ Countdown'}
        </h2>
        <p className="section-subtitle">
          {mode === 'age'
            ? 'Every moment of your journey has been amazing'
            : 'The world eagerly awaits your next birthday'}
        </p>

        {/* Toggle buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginBottom: '2.5rem' }}>
          <button
            className={mode === 'age' ? 'btn-primary' : 'btn-secondary'}
            onClick={() => setMode('age')}
            style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}
          >
            🎂 Age Counter
          </button>
          <button
            className={mode === 'countdown' ? 'btn-primary' : 'btn-secondary'}
            onClick={() => setMode('countdown')}
            style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}
          >
            ⏰ Next Birthday
          </button>
        </div>

        {/* Timer Grid */}
        <div className="countdown-grid">
          {units.map((unit) => (
            <div key={unit.label} className="countdown-unit glass-card">
              <AnimatedNumber value={unit.value} />
              <span className="countdown-label">{unit.label}</span>
            </div>
          ))}
        </div>

        {isToday && (
          <div className="celebration-banner" style={{ marginTop: '2rem', maxWidth: '500px', margin: '2rem auto 0' }}>
            🎊 Today is the day! Happy Birthday, Alexandra! You're absolutely amazing! 🎉
          </div>
        )}
      </div>
    </section>
  );
};
