// ── useTypewriter Hook ──
// Animates text character by character

import { useState, useEffect } from 'react';

interface TypewriterOptions {
  speed?: number;      // ms per character
  delay?: number;      // initial delay in ms
  loop?: boolean;      // repeat infinitely
  deleteSpeed?: number;
}

export function useTypewriter(
  texts: string[],
  { speed = 80, delay = 0, loop = false, deleteSpeed = 40 }: TypewriterOptions = {}
) {
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [textIndex, setTextIndex] = useState(0);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (isDone && !loop) return;

    const currentText = texts[textIndex] || '';

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (displayText.length < currentText.length) {
          setDisplayText(currentText.slice(0, displayText.length + 1));
        } else {
          // Finished typing this text
          if (texts.length === 1 && !loop) {
            setIsDone(true);
            return;
          }
          setTimeout(() => setIsDeleting(true), 1500);
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(displayText.slice(0, -1));
        } else {
          setIsDeleting(false);
          setTextIndex((i) => (i + 1) % texts.length);
        }
      }
    }, delay > 0 && displayText.length === 0 && textIndex === 0 ? delay : isDeleting ? deleteSpeed : speed);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, textIndex, texts, speed, deleteSpeed, delay, loop, isDone]);

  return { displayText, isDone };
}
