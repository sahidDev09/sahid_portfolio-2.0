const SOUND_STORAGE_KEY = "portfolio_sound_muted";
export const SOUND_EVENT = "portfolio-sound-state-change";

let audioCache: HTMLAudioElement | null = null;
let isInitialized = false;
let lastPointerDownTime = 0;

export function getSoundMuted(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(SOUND_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

export function setSoundMuted(muted: boolean): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(SOUND_STORAGE_KEY, String(muted));
    window.dispatchEvent(
      new CustomEvent(SOUND_EVENT, { detail: { muted } })
    );
  } catch {
    // Ignore storage errors
  }
}

export function playClickSound(): void {
  if (typeof window === "undefined") return;
  if (getSoundMuted()) return;

  try {
    if (!audioCache) {
      audioCache = new Audio("/sounds/mouse-click.mp3");
      audioCache.volume = 0.4;
      audioCache.preload = "auto";
    }

    let sound: HTMLAudioElement;
    try {
      sound = audioCache.cloneNode(true) as HTMLAudioElement;
    } catch {
      sound = new Audio("/sounds/mouse-click.mp3");
    }

    sound.volume = 0.4;
    sound.play().catch(() => {
      // Ignore autoplay / user gesture exceptions
    });
  } catch {
    // Ignore audio playback errors
  }
}

export function toggleSound(): boolean {
  const current = getSoundMuted();
  const next = !current;
  setSoundMuted(next);
  if (!next) {
    playClickSound();
  }
  return next;
}

function isClickableElement(target: EventTarget | null): boolean {
  if (!target || !(target instanceof Element)) return false;

  // Don't play if clicking directly on sound toggle button (handled separately)
  if (target.closest("[data-sound-toggle]")) return false;

  // Don't play on disabled elements
  if (target.closest("button:disabled, [aria-disabled='true']")) return false;

  // Match native interactive elements and ARIA roles
  const interactive = target.closest(
    'a[href], button, input, select, textarea, summary, [role="button"], [role="link"], [role="tab"], [role="menuitem"], [role="switch"], [data-clickable]'
  );
  if (interactive) return true;

  // Check computed cursor style for elements styled with cursor: pointer
  try {
    let current: Element | null = target;
    let depth = 0;
    while (current && current !== document.body && depth < 5) {
      if (window.getComputedStyle(current).cursor === "pointer") {
        return true;
      }
      current = current.parentElement;
      depth++;
    }
  } catch {
    // Ignore style inspection errors
  }

  return false;
}

export function initGlobalClickSound(): () => void {
  if (typeof window === "undefined" || isInitialized) {
    return () => {};
  }

  isInitialized = true;

  try {
    audioCache = new Audio("/sounds/mouse-click.mp3");
    audioCache.preload = "auto";
    audioCache.volume = 0.4;
  } catch {
    // Ignore preload error
  }

  const handlePointerDown = (e: PointerEvent) => {
    // Only handle primary button (left click)
    if (e.button !== 0) return;
    // On touch, do not play on initial touch down to avoid sound while scrolling
    if (e.pointerType === "touch") return;

    if (!isClickableElement(e.target)) return;

    lastPointerDownTime = Date.now();
    playClickSound();
  };

  const handleClick = (e: MouseEvent) => {
    // If pointerdown already triggered sound recently (e.g. mouse click), skip
    if (Date.now() - lastPointerDownTime < 400) return;

    if (!isClickableElement(e.target)) return;

    playClickSound();
  };

  window.addEventListener("pointerdown", handlePointerDown, { passive: true });
  window.addEventListener("click", handleClick, { passive: true });

  return () => {
    window.removeEventListener("pointerdown", handlePointerDown);
    window.removeEventListener("click", handleClick);
    isInitialized = false;
  };
}
