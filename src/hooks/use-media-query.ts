'use client';

import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    const media = window.matchMedia(query);
    
    // Atualiza a flag caso tenha mudado desde a montagem inicial
    const listener = () => {
      setMatches(media.matches);
    };
    
    // Suporte para browsers mais antigos e modernos
    if (media.addEventListener) {
      media.addEventListener('change', listener);
    } else {
      media.addListener(listener as EventListener); // Fallback
    }

    return () => {
      if (media.removeEventListener) {
        media.removeEventListener('change', listener);
      } else {
        media.removeListener(listener as EventListener); // Fallback
      }
    };
  }, [query]);

  return matches;
}
