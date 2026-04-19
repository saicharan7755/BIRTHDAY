// ── Navbar Component ──
// Floating pill navigation with theme toggle, music toggle, and mobile menu

import React, { useState, useEffect } from 'react';

interface NavbarProps {
  isDark: boolean;
  onThemeToggle: () => void;
  isMusicOpen: boolean;
  onMusicToggle: () => void;
}

const NAV_LINKS = [
  { href: '#hero', label: 'Home' },
  { href: '#message', label: 'Message' },
  { href: '#gallery', label: 'Gallery' },
  { href: '#cake', label: 'Cake' },
  { href: '#timeline', label: 'Memories' },
  { href: '#wishes', label: 'Wishes' },
];

export const Navbar: React.FC<NavbarProps> = ({
  isDark,
  onThemeToggle,
  isMusicOpen,
  onMusicToggle,
}) => {
  const [activeSection, setActiveSection] = useState('hero');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      // Active section detection
      const sections = NAV_LINKS.map((l) => l.href.slice(1));
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && window.scrollY >= el.offsetTop - 200) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav
      className="navbar"
      style={{
        boxShadow: scrolled ? 'var(--shadow-lg)' : 'var(--shadow-md)',
        padding: scrolled ? '0.5rem 1.25rem' : '0.6rem 1.5rem',
      }}
    >
      {/* Logo */}
      <span className="navbar__logo">🎂 HBD</span>

      {/* Links */}
      <ul className="navbar__links">
        {NAV_LINKS.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              className={activeSection === link.href.slice(1) ? 'active' : ''}
              onClick={(e) => handleNavClick(e, link.href)}
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>

      {/* Actions */}
      <div className="navbar__actions">
        <button
          className="music-toggle"
          onClick={onMusicToggle}
          title={isMusicOpen ? 'Close Player' : 'Open Music Player'}
          aria-label="Toggle music player"
        >
          {isMusicOpen ? '🎵' : '🎶'}
        </button>
        <button
          className="theme-toggle"
          onClick={onThemeToggle}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle theme"
        >
          {isDark ? '☀️' : '🌙'}
        </button>
      </div>
    </nav>
  );
};
