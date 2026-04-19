// ── GallerySection Component ──
// Photo grid with lightbox expand effect and smooth hover animations

import React, { useState, useEffect, useRef } from 'react';

interface GalleryImage {
  src: string;
  caption: string;
  alt: string;
}

const GALLERY_IMAGES: GalleryImage[] = [
  {
    src: '/gallery/photo1.jpg',
    caption: 'A magical birthday celebration ✨',
    alt: 'Birthday celebration with balloons and cake',
  },
  {
    src: '/gallery/photo2.jpg',
    caption: 'Pure joy and happiness 🎊',
    alt: 'Joyful birthday celebration outdoors',
  },
  {
    src: '/gallery/photo3.jpg',
    caption: 'The little details that make it special 🌸',
    alt: 'Beautiful birthday flat lay with flowers',
  },
  {
    src: '/gallery/photo4.jpg',
    caption: 'A cake as sweet as you 🎂',
    alt: 'Elegant birthday cake with flowers',
  },
  {
    src: '/gallery/photo5.jpg',
    caption: 'Memories made with the ones you love 💕',
    alt: 'Friends celebrating together',
  },
  {
    src: '/gallery/photo6.jpg',
    caption: 'Every new year is a new adventure 🌅',
    alt: 'Beautiful sunrise on birthday morning',
  },
];

export const GallerySection: React.FC = () => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

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

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') setLightboxIndex((i) => (i! + 1) % GALLERY_IMAGES.length);
      if (e.key === 'ArrowLeft') setLightboxIndex((i) => (i! - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightboxIndex]);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    document.body.style.overflow = lightboxIndex !== null ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [lightboxIndex]);

  const currentImage = lightboxIndex !== null ? GALLERY_IMAGES[lightboxIndex] : null;

  return (
    <section
      className="gallery-section reveal"
      id="gallery"
      ref={sectionRef as React.RefObject<HTMLElement>}
      aria-label="Photo gallery"
    >
      <div className="section-container">
        <h2 className="section-title">Memory Gallery 📸</h2>
        <p className="section-subtitle">Click any photo to expand — beautiful moments deserve a closer look</p>

        {/* Gallery Grid */}
        <div className="gallery-grid">
          {GALLERY_IMAGES.map((img, index) => (
            <article
              key={img.src}
              className="gallery-item"
              onClick={() => setLightboxIndex(index)}
              role="button"
              tabIndex={0}
              aria-label={`Open photo: ${img.alt}`}
              onKeyDown={(e) => { if (e.key === 'Enter') setLightboxIndex(index); }}
              style={{
                animationDelay: `${index * 0.1}s`,
              }}
            >
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                decoding="async"
              />
              <div className="gallery-item__overlay">
                <p className="gallery-item__caption">{img.caption}</p>
              </div>
              <div className="gallery-item__expand" aria-hidden="true">⛶</div>
            </article>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {currentImage && lightboxIndex !== null && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`Photo lightbox: ${currentImage.alt}`}
          onClick={(e) => { if (e.target === e.currentTarget) setLightboxIndex(null); }}
        >
          <div className="lightbox__content">
            {/* Close button */}
            <button
              className="lightbox__close"
              onClick={() => setLightboxIndex(null)}
              aria-label="Close lightbox"
            >
              ✕
            </button>

            {/* Prev button */}
            <button
              className="lightbox__nav lightbox__nav--prev"
              onClick={() => setLightboxIndex((lightboxIndex - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length)}
              aria-label="Previous photo"
            >
              ‹
            </button>

            {/* Image */}
            <img
              className="lightbox__img"
              src={currentImage.src}
              alt={currentImage.alt}
              key={currentImage.src}
            />

            {/* Caption */}
            <p className="lightbox__caption">
              {currentImage.caption}
              <span style={{ marginLeft: '0.75rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>
                {lightboxIndex + 1} / {GALLERY_IMAGES.length}
              </span>
            </p>

            {/* Next button */}
            <button
              className="lightbox__nav lightbox__nav--next"
              onClick={() => setLightboxIndex((lightboxIndex + 1) % GALLERY_IMAGES.length)}
              aria-label="Next photo"
            >
              ›
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
