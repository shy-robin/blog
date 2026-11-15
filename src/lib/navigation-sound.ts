let context: AudioContext | undefined;
let woodClick: AudioBuffer | undefined;

/** A soft wooden tap: a filtered strike and quickly damped resonances. */
export function playNavigationSound() {
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as Window & { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioContextClass) return;
    if (!context || context.state === "closed") {
      context = new AudioContextClass({ latencyHint: "interactive" });
      woodClick = undefined;
    }
    const audio = context;
    const play = () => {
      if (!woodClick) {
        woodClick = audio.createBuffer(
          1,
          Math.ceil(audio.sampleRate * 0.07),
          audio.sampleRate,
        );
        const samples = woodClick.getChannelData(0);
        const smoothing =
          1 - Math.exp((-2 * Math.PI * 1200) / audio.sampleRate);
        let noise = 0;
        let peak = 0;
        for (let i = 0; i < samples.length; i++) {
          const time = i / audio.sampleRate;
          noise += smoothing * (Math.random() * 2 - 1 - noise);
          const strike = noise * 0.7 * Math.exp(-time * 210);
          const body =
            Math.sin(2 * Math.PI * 470 * time) * Math.exp(-time * 95) +
            0.35 * Math.sin(2 * Math.PI * 810 * time) * Math.exp(-time * 135) +
            0.16 * Math.sin(2 * Math.PI * 1230 * time) * Math.exp(-time * 180);
          // Round the attack and fade the tail to avoid a sharp digital click.
          const envelope =
            Math.min(1, time / 0.0015) * Math.min(1, (0.07 - time) / 0.01);
          samples[i] = (strike + body) * envelope;
          peak = Math.max(peak, Math.abs(samples[i]));
        }
        for (let i = 0; i < samples.length; i++)
          samples[i] *= 0.22 / (peak || 1);
      }
      const source = audio.createBufferSource();
      source.buffer = woodClick;
      source.connect(audio.destination);
      source.onended = () => source.disconnect();
      source.start();
    };
    // Keep both resume() and start() in the original tap gesture. Starting a
    // source while suspended queues it until the context resumes; awaiting the
    // promise first can lose gesture-based permission in mobile browsers.
    if (audio.state !== "running") void audio.resume().catch(() => {});
    play();
  } catch {
    // Audio is optional; unsupported or blocked playback never blocks navigation.
  }
}
