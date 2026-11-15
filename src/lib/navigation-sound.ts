let context: AudioContext | undefined;

/** A short, quiet tick, created locally after an explicit navigation gesture. */
export function playNavigationSound() {
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as Window & { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioContextClass) return;
    if (!context || context.state === "closed") {
      context = new AudioContextClass({ latencyHint: "interactive" });
    }
    const audio = context;
    const play = () => {
      const oscillator = audio.createOscillator();
      const gain = audio.createGain();
      const now = audio.currentTime;
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(950, now);
      oscillator.frequency.exponentialRampToValueAtTime(480, now + 0.04);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.045, now + 0.003);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);
      oscillator.connect(gain);
      gain.connect(audio.destination);
      oscillator.onended = () => {
        oscillator.disconnect();
        gain.disconnect();
      };
      oscillator.start(now);
      oscillator.stop(now + 0.05);
    };
    if (audio.state === "running") play();
    else
      void audio
        .resume()
        .then(play)
        .catch(() => {});
  } catch {
    // Audio is optional; unsupported or blocked playback never blocks navigation.
  }
}
