import { useEffect, useRef } from "preact/hooks";

// TODO: use Awaited instead
const makePlayer = async (src: string): Promise<PlayerAPI> => {
  let source: AudioBufferSourceNode | null = null;
  let audioContext = new window.AudioContext();
  let response = await fetch(src);
  let arrayBuffer = await response.arrayBuffer();
  let audioData = await audioContext.decodeAudioData(arrayBuffer);

  source = audioContext.createBufferSource();
  source.buffer = audioData;

  let hasPlayed = false;

  // Connect the source to the context's destination (the speakers)
  source.connect(audioContext.destination);

  const play = () => {
    if (!source) return;
    if (hasPlayed) {
      source.stop();
      source.disconnect();
    }

    source = audioContext.createBufferSource();
    source.buffer = audioData;
    source.connect(audioContext.destination);
    source.start(0, 0);
    hasPlayed = true;
  };

  const dispose = () => {
    if (!source) return;
    // don't stop the buffer if it hasn't started yet
    if (source.context.currentTime === 0) return;

    source.stop();
    source.disconnect();
  };

  return {
    play,
    dispose,
  };
};

type PlayerAPI = {
  play: () => void;
  dispose: () => void;
};

export const usePlomk = () => {
  const playerRef = useRef<PlayerAPI | null>(null);

  async function plomkNow() {
    if (!playerRef.current) return;
    console.log("Plomk: Playing");
    playerRef.current.play();
  }

  useEffect(() => {
    if (!playerRef.current) {
      console.log("Plomk: Creating audio element");
      makePlayer("/sfx/click_2.mp3").then((player) => {
        playerRef.current = player;
      });
    }

    const onInteract = (e: PointerEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      const isPlomkable =
        target.matches("a, button, select") ||
        target.closest("a, button, select");

      if (!isPlomkable) return;

      plomkNow();
    };

    document.addEventListener("pointerdown", onInteract, {
      passive: true,
    });

    return () => {
      document.removeEventListener("pointerdown", onInteract);
      if (!playerRef.current) return;
      playerRef.current.dispose();
    };
  }, []);
};
