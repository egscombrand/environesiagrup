'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

type ReaderState = 'idle' | 'playing' | 'paused' | 'unsupported';

const LOCALE_TO_SPEECH_LANG: Record<string, string> = { id: 'id-ID', en: 'en-US', zh: 'zh-CN' };

/**
 * Feature 27 (pembaca teks). Reads the page's <main> content aloud via the
 * Web Speech API — never autoplays (only starts on an explicit click),
 * never requests any permission (speechSynthesis needs none), and degrades
 * to a clear "tidak didukung" state rather than a silently-broken button
 * when the browser has no synthesis voices available at all.
 */
export function useTextReader(locale: string) {
  const [state, setState] = useState<ReaderState>('idle');
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      setState('unsupported');
    }
  }, []);

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) window.speechSynthesis.cancel();
    };
  }, []);

  const play = useCallback(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      setState('unsupported');
      return;
    }

    // Resume instead of restarting if already mid-read-and-paused.
    if (state === 'paused') {
      window.speechSynthesis.resume();
      setState('playing');
      return;
    }

    const main = document.getElementById('main-content');
    const text = main?.innerText?.trim();
    if (!text) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = LOCALE_TO_SPEECH_LANG[locale] ?? 'id-ID';
    utterance.onend = () => setState('idle');
    utterance.onerror = () => setState('idle');
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setState('playing');
  }, [locale, state]);

  const pause = useCallback(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.pause();
    setState('paused');
  }, []);

  const stop = useCallback(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    setState('idle');
  }, []);

  return { state, play, pause, stop };
}
