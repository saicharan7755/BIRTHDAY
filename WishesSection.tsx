// ── WishesSection Component ──
// Guest message wall — add your birthday wishes (frontend only, uses localStorage)

import React, { useState, useEffect, useRef } from 'react';

interface Wish {
  id: string;
  name: string;
  message: string;
  emoji: string;
  time: string;
}

const EMOJI_OPTIONS = ['🎉', '💖', '🌟', '🎂', '🥳', '🌸', '✨', '🦋', '🎊', '💐'];

const DEFAULT_WISHES: Wish[] = [
  {
    id: '1',
    name: 'Sarah M.',
    message: 'Happy Birthday, beautiful soul! You deserve every bit of happiness that comes your way. Wishing you a magical day! 🌟',
    emoji: '💖',
    time: 'Just now',
  },
  {
    id: '2',
    name: 'James K.',
    message: 'To the most amazing person I know — may this year bring you more adventures, laughter, and all the things you love!',
    emoji: '🎉',
    time: '2 minutes ago',
  },
  {
    id: '3',
    name: 'Emma & Tom',
    message: 'Sending you all our love on your special day! You make the world a better, brighter place just by being in it. 🌈',
    emoji: '🌸',
    time: '5 minutes ago',
  },
];

const STORAGE_KEY = 'hbd_wishes';

function loadWishes(): Wish[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return [...DEFAULT_WISHES, ...JSON.parse(stored)];
  } catch {
    // ignore
  }
  return DEFAULT_WISHES;
}

function saveWish(wish: Wish) {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const existing: Wish[] = stored ? JSON.parse(stored) : [];
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...existing, wish]));
  } catch {
    // ignore
  }
}

export const WishesSection: React.FC = () => {
  const [wishes, setWishes] = useState<Wish[]>(loadWishes);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState(EMOJI_OPTIONS[0]);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Scroll reveal
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) el.classList.add('visible'); },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) { setError('Please enter your name 😊'); return; }
    if (!message.trim()) { setError('Please write a message 💌'); return; }
    if (message.trim().length < 10) { setError('Message too short — say a little more! 📝'); return; }

    const newWish: Wish = {
      id: Date.now().toString(),
      name: name.trim(),
      message: message.trim(),
      emoji: selectedEmoji,
      time: 'Just now',
    };

    setWishes((prev) => [newWish, ...prev]);
    saveWish(newWish);
    setName('');
    setMessage('');
    setSelectedEmoji(EMOJI_OPTIONS[0]);
    setSubmitted(true);

    // Scroll list to top to show new wish
    setTimeout(() => {
      listRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);

    setTimeout(() => setSubmitted(false), 3000);
  };

  const getInitial = (name: string) => name.charAt(0).toUpperCase();

  return (
    <section
      className="wishes-section reveal"
      id="wishes"
      ref={sectionRef as React.RefObject<HTMLElement>}
      aria-label="Birthday wishes"
    >
      <div className="section-container">
        <h2 className="section-title">Birthday Wishes 💌</h2>
        <p className="section-subtitle">Leave a message and make her day even more special</p>

        <div className="wishes-layout">
          {/* Form */}
          <div className="wishes-form glass-card">
            <h3>✍️ Leave Your Wish</h3>

            {submitted ? (
              <div
                className="celebration-banner"
                style={{ marginBottom: 0, marginTop: '1rem' }}
              >
                🎉 Your wish has been sent! Thank you so much!
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <div className="form-group">
                  <label htmlFor="wish-name">Your Name</label>
                  <input
                    id="wish-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Sarah, James & Emma..."
                    maxLength={50}
                    autoComplete="name"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="wish-message">Your Birthday Message</label>
                  <textarea
                    id="wish-message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write something beautiful from your heart... 💕"
                    rows={4}
                    maxLength={280}
                  />
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'right', marginTop: '0.25rem' }}>
                    {message.length}/280
                  </div>
                </div>

                <div className="form-group">
                  <label>Choose an Emoji</label>
                  <div className="emoji-picker">
                    {EMOJI_OPTIONS.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        className={`emoji-btn ${selectedEmoji === emoji ? 'selected' : ''}`}
                        onClick={() => setSelectedEmoji(emoji)}
                        aria-label={`Select emoji ${emoji}`}
                        aria-pressed={selectedEmoji === emoji}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                {error && (
                  <p style={{ color: 'var(--accent-3)', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
                    ⚠️ {error}
                  </p>
                )}

                <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  {selectedEmoji} Send My Wish!
                </button>
              </form>
            )}
          </div>

          {/* Wishes List */}
          <div ref={listRef} className="wishes-list" aria-label="Submitted wishes" aria-live="polite">
            {wishes.length === 0 ? (
              <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.75rem' }}>💌</span>
                <p>Be the first to leave a birthday wish!</p>
              </div>
            ) : (
              wishes.map((wish) => (
                <article key={wish.id} className="wish-card glass-card">
                  <div className="wish-card__header">
                    {/* Avatar */}
                    <div className="wish-card__avatar" aria-hidden="true">
                      {getInitial(wish.name)}
                    </div>
                    <div>
                      <p className="wish-card__name">{wish.name}</p>
                      <p className="wish-card__time">{wish.time}</p>
                    </div>
                    <span className="wish-card__emoji" aria-hidden="true">{wish.emoji}</span>
                  </div>
                  <p className="wish-card__message">"{wish.message}"</p>
                </article>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
