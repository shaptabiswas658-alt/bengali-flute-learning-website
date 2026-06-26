"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

type AmbientSoundPlayerProps = {
  storageKey: string;
  primaryAudioUrl: string;
  secondaryAudioUrl?: string;
  primaryVolume?: number;
  secondaryVolume?: number;
  labelOnBn: string;
  labelOffBn: string;
  descriptionBn: string;
};

export function AmbientSoundPlayer({
  storageKey,
  primaryAudioUrl,
  secondaryAudioUrl,
  primaryVolume = 0.14,
  secondaryVolume = 0.1,
  labelOnBn,
  labelOffBn,
  descriptionBn,
}: AmbientSoundPlayerProps) {
  const primaryRef = useRef<HTMLAudioElement | null>(null);
  const secondaryRef = useRef<HTMLAudioElement | null>(null);

  const [enabled, setEnabled] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    if (saved === "off") {
      setEnabled(false);
    }
    setReady(true);
  }, [storageKey]);

  useEffect(() => {
    const primary = primaryRef.current;
    const secondary = secondaryRef.current;
    if (!primary || !ready) return;

    primary.loop = true;
    primary.volume = primaryVolume;

    if (secondary) {
      secondary.loop = true;
      secondary.volume = secondaryVolume;
    }

    const tryPlay = async () => {
      try {
        await primary.play();
      } catch {
        // browser autoplay restrictions
      }

      if (secondary) {
        try {
          await secondary.play();
        } catch {
          // browser autoplay restrictions
        }
      }
    };

    if (enabled) {
      void tryPlay();

      const startOnGesture = () => {
        void tryPlay();
        window.removeEventListener("click", startOnGesture);
        window.removeEventListener("keydown", startOnGesture);
        window.removeEventListener("touchstart", startOnGesture);
      };

      window.addEventListener("click", startOnGesture);
      window.addEventListener("keydown", startOnGesture);
      window.addEventListener("touchstart", startOnGesture);

      return () => {
        window.removeEventListener("click", startOnGesture);
        window.removeEventListener("keydown", startOnGesture);
        window.removeEventListener("touchstart", startOnGesture);
      };
    }

    primary.pause();
    primary.currentTime = 0;
    if (secondary) {
      secondary.pause();
      secondary.currentTime = 0;
    }
  }, [enabled, primaryVolume, ready, secondaryVolume]);

  const toggle = () => {
    const next = !enabled;
    setEnabled(next);
    window.localStorage.setItem(storageKey, next ? "on" : "off");
  };

  return (
    <>
      <audio ref={primaryRef} src={primaryAudioUrl} preload="auto" aria-hidden="true" />
      {secondaryAudioUrl ? <audio ref={secondaryRef} src={secondaryAudioUrl} preload="auto" aria-hidden="true" /> : null}

      <button
        type="button"
        onClick={toggle}
        className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/90 px-4 py-2 text-sm font-medium text-emerald-900 shadow-lg backdrop-blur transition hover:bg-emerald-50"
        aria-pressed={enabled}
        aria-label={enabled ? labelOffBn : labelOnBn}
      >
        {enabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
        {enabled ? labelOnBn : labelOffBn}
      </button>

      <p className="sr-only">{descriptionBn}</p>
    </>
  );
}
