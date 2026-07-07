/**
 * Escarté sound library.
 * Pre-loads audio and provides simple play() helpers. Volume-tuned.
 */

const SOUNDS = {
  click: {
    url: "https://customer-assets.emergentagent.com/job_spark-assess/artifacts/wx8rr4ca_button-click.mp3",
    volume: 0.35,
  },
  fire: {
    url: "https://customer-assets.emergentagent.com/job_spark-assess/artifacts/rbwogts9_37ecb736-12e1-4328-83c6-af7479b45b26-online-audio-converter.mp3",
    volume: 0.6,
  },
  confetti: {
    url: "https://customer-assets.emergentagent.com/job_spark-assess/artifacts/f2ohn07j_confetti-pop.mp3",
    volume: 0.55,
  },
  typing: {
    url: "https://customer-assets.emergentagent.com/job_spark-assess/artifacts/o77nq9hy_keyboard-sound-effect-typing.mp3",
    volume: 0.3,
  },
  error: {
    url: "https://customer-assets.emergentagent.com/job_spark-assess/artifacts/4gnp8xqd_typing-error.mp3",
    volume: 0.5,
  },
};

const cache = {};

function get(name) {
  if (cache[name]) return cache[name];
  const cfg = SOUNDS[name];
  if (!cfg) return null;
  const a = new Audio(cfg.url);
  a.preload = "auto";
  a.volume = cfg.volume;
  cache[name] = a;
  return a;
}

export function playSound(name) {
  try {
    const a = get(name);
    if (!a) return;
    // Clone so overlapping plays don't cut each other off
    const clone = a.cloneNode();
    clone.volume = SOUNDS[name].volume;
    clone.play().catch(() => {});
  } catch { /* ignore */ }
}

export function stopSound(name) {
  const a = cache[name];
  if (!a) return;
  try { a.pause(); a.currentTime = 0; } catch { /* ignore */ }
}

// Preload on first import
if (typeof window !== "undefined") {
  Object.keys(SOUNDS).forEach((k) => get(k));
}

/** Attach a global "any button click" listener. Call once at app root. */
export function installGlobalClickSound() {
  if (typeof window === "undefined" || window.__escarteClickInstalled) return;
  window.__escarteClickInstalled = true;
  document.addEventListener(
    "click",
    (e) => {
      const el = e.target?.closest?.("button, a[href], [role='button']");
      if (!el) return;
      // Skip if explicitly opted out
      if (el.dataset?.noClickSound === "true") return;
      playSound("click");
    },
    true
  );
}
