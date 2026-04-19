// ── Footer Component ──
// Elegant footer with links and heart animation

import React from 'react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="footer" role="contentinfo" aria-label="Site footer">
      {/* Back to top */}
      <button
        onClick={scrollToTop}
        className="btn-secondary"
        style={{ marginBottom: '1.5rem', fontSize: '0.85rem' }}
        aria-label="Scroll back to top"
      >
        ↑ Back to Top
      </button>

      {/* Main text */}
      <p className="footer__text">
        Made with{' '}
        <span className="footer__heart" aria-label="love">❤️</span>
        {' '}for the most amazing person in the world
      </p>

      <p className="footer__text" style={{ marginTop: '0.5rem', fontSize: '0.8rem' }}>
        🎂 Happy Birthday, Alexandra! Wishing you an extraordinary year ahead.
      </p>

      {/* Links */}
      <nav className="footer__links" aria-label="Footer navigation">
        {[
          { href: '#hero', label: 'Home' },
          { href: '#message', label: 'Message' },
          { href: '#gallery', label: 'Gallery' },
          { href: '#cake', label: 'Cake' },
          { href: '#timeline', label: 'Memories' },
          { href: '#wishes', label: 'Wishes' },
        ].map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={(e) => {
              e.preventDefault();
              document.querySelector(link.href)?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            {link.label}
          </a>
        ))}
      </nav>

      {/* Copyright */}
      <p
        style={{ marginTop: '1.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}
      >
        © {currentYear} · Built with React + ❤️ · No birthday was harmed in the making of this website
      </p>
    </footer>
  );
};
