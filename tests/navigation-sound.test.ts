import assert from "node:assert/strict";
import { test } from "node:test";
import { playNavigationSound } from "../src/lib/navigation-sound";

test("a suspended context starts its source inside the original user gesture", async () => {
  const calls: string[] = [];
  let resolveResume!: () => void;
  let instance: AudioMock;
  class AudioMock {
    state = "suspended";
    sampleRate = 48000;
    destination = {};
    constructor() {
      instance = this;
    }
    resume() {
      calls.push("resume");
      return new Promise<void>((resolve) => {
        resolveResume = resolve;
      });
    }
    createBuffer(_channels: number, length: number) {
      const samples = new Float32Array(length);
      return { getChannelData: () => samples };
    }
    createBufferSource() {
      return {
        connect() {},
        disconnect() {},
        start() {
          calls.push("start");
        },
      };
    }
  }
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: { AudioContext: AudioMock },
  });
  try {
    playNavigationSound();
    assert.deepEqual(calls, ["resume", "start"]);
    resolveResume();
    await Promise.resolve();
    assert.deepEqual(
      calls,
      ["resume", "start"],
      "resuming must not replay the tap",
    );
  } finally {
    instance!.state = "closed";
    resolveResume?.();
    Reflect.deleteProperty(globalThis, "window");
  }
});

test("missing Web Audio support never interrupts navigation", () => {
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: {},
  });
  try {
    assert.doesNotThrow(playNavigationSound);
  } finally {
    Reflect.deleteProperty(globalThis, "window");
  }
});
