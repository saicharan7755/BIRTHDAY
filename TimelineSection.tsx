// ── TimelineSection Component ──
// A vertical timeline of memories with scroll reveal animations

import React, { useEffect, useRef } from 'react';

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  emoji: string;
}

const TIMELINE_EVENTS: TimelineEvent[] = [
  {
    year: '1999',
    emoji: '👶',
    title: 'Welcome to the World',
    description:
      'A star was born. The universe gained one of its most brilliant lights, and the world would never be the same again.',
  },
  {
    year: '2004',
    emoji: '🏫',
    title: 'First Day of School',
    description:
      'With a new backpack and bright eyes, you stepped into a world of learning — curious, brave, and ready to conquer everything.',
  },
  {
    year: '2009',
    emoji: '🎨',
    title: 'Discovering Passions',
    description:
      'Music, art, stories — you began finding the things that made your heart sing. Creativity became your language, your superpower.',
  },
  {
    year: '2013',
    emoji: '🌸',
    title: 'Finding Your Voice',
    description:
      'You stepped into who you truly are — confident, compassionate, and completely, unapologetically yourself. The world noticed.',
  },
  {
    year: '2017',
    emoji: '🎓',
    title: 'A New Chapter Begins',
    description:
      'Graduation opened a whole new world of possibilities. Armed with knowledge, ambition, and an unstoppable spirit, you soared.',
  },
  {
    year: '2021',
    emoji: '🌍',
    title: 'Adventures & Growth',
    description:
      'New places, new faces, new experiences. You embraced the beautiful chaos of life and turned every challenge into a triumph.',
  },
  {
    year: 'Today',
    emoji: '🌟',
    title: 'The Best Chapter Yet',
    description:
      'Here you are — radiant, remarkable, and ready for everything that comes next. This birthday marks the beginning of your best years.',
  },
];

export const TimelineSection: React.FC = () => {
  const timelineRef = useRef<HTMLElement>(null);

  // Animate timeline items on scroll
  useEffect(() => {
    const items = document.querySelectorAll('.timeline-item');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('visible');
            }, i * 100);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  // Section reveal
  useEffect(() => {
    const el = timelineRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) el.classList.add('visible'); },
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      className="timeline-section reveal"
      id="timeline"
      ref={timelineRef as React.RefObject<HTMLElement>}
      aria-label="Timeline of memories"
    >
      <div className="section-container">
        <h2 className="section-title">Journey of a Lifetime 🗺️</h2>
        <p className="section-subtitle">Milestones that shaped the wonderful person you are today</p>

        <div className="timeline" role="list">
          {TIMELINE_EVENTS.map((event, index) => (
            <article
              key={event.year}
              className="timeline-item"
              role="listitem"
              style={{ transitionDelay: `${index * 0.08}s` }}
            >
              {/* Center dot */}
              <div className="timeline-dot" aria-hidden="true" />

              {/* Card */}
              <div className="timeline-card glass-card">
                <span className="timeline-card__emoji" aria-hidden="true">
                  {event.emoji}
                </span>
                <p className="timeline-card__year">{event.year}</p>
                <h3 className="timeline-card__title">{event.title}</h3>
                <p className="timeline-card__desc">{event.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
