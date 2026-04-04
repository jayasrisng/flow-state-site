let clickAudio: HTMLAudioElement | null = null;
const CLICK_SOUND_URL = `${import.meta.env.BASE_URL}sounds/click.mp3`;
const CLICK_SOUND_ENABLED_KEY = "flow-state:click-sound-enabled";

let clickSoundEnabled = true;
if (typeof window !== "undefined") {
  const savedPreference = window.localStorage.getItem(CLICK_SOUND_ENABLED_KEY);
  if (savedPreference === "false") {
    clickSoundEnabled = false;
  }
}

export function isClickSoundEnabled() {
  return clickSoundEnabled;
}

export function setClickSoundEnabled(enabled: boolean) {
  clickSoundEnabled = enabled;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(CLICK_SOUND_ENABLED_KEY, String(enabled));
  }

  if (!enabled && clickAudio) {
    clickAudio.pause();
    clickAudio.currentTime = 0;
  }
}

export function playClickSound() {
  if (!clickSoundEnabled) return;

  if (!clickAudio) {
    clickAudio = new Audio(CLICK_SOUND_URL);
    clickAudio.volume = 0.18;
  }

  clickAudio.currentTime = 0;
  clickAudio.play().catch(() => {
    // ignore playback errors
  });
}
