let clickAudio: HTMLAudioElement | null = null;
const CLICK_SOUND_URL = `${import.meta.env.BASE_URL}sounds/click.mp3`;

export function playClickSound() {
  if (!clickAudio) {
    clickAudio = new Audio(CLICK_SOUND_URL);
    clickAudio.volume = 0.18;
  }

  clickAudio.currentTime = 0;
  clickAudio.play().catch(() => {
    // ignore playback errors
  });
}
