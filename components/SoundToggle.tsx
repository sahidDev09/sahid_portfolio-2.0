"use client";

import { useState, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { getSoundMuted, toggleSound, initGlobalClickSound, SOUND_EVENT } from "@/lib/sound";

export function SoundToggle() {
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    initGlobalClickSound();
    setIsMuted(getSoundMuted());

    const handleSoundChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ muted: boolean }>;
      if (customEvent.detail) {
        setIsMuted(customEvent.detail.muted);
      }
    };

    window.addEventListener(SOUND_EVENT, handleSoundChange);
    return () => {
      window.removeEventListener(SOUND_EVENT, handleSoundChange);
    };
  }, []);

  const handleToggleSound = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const muted = toggleSound();
    setIsMuted(muted);
  };

  return (
    <button
      type="button"
      data-sound-toggle="true"
      onClick={handleToggleSound}
      className="fixed top-4 right-4 sm:top-6 sm:right-6 z-[100] w-10 h-10 2xl:w-12 2xl:h-12 rounded-full bg-gray-800/80 hover:bg-gray-700/90 backdrop-blur-xl border border-purple-400/20 hover:border-purple-400/70 text-white shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center cursor-pointer"
      aria-label={isMuted ? "Unmute click sounds" : "Mute click sounds"}
      title={isMuted ? "Sound Off" : "Sound On"}>
      {isMuted ? (
        <VolumeX className="w-4 h-4 2xl:w-5 2xl:h-5 text-zinc-400" />
      ) : (
        <Volume2 className="w-4 h-4 2xl:w-5 2xl:h-5 text-[#9832ff]" />
      )}
    </button>
  );
}

export default SoundToggle;
