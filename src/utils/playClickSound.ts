let clickAudio: HTMLAudioElement | null = null;

export function playClickSound() {
  if (!clickAudio) {
    clickAudio = new Audio("/sounds/click.mp3");
    clickAudio.volume = 0.18;
  }

  clickAudio.currentTime = 0;
  clickAudio.play().catch(() => {
    // ignore playback errors
  });
}