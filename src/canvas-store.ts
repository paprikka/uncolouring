import { signal, computed } from "@preact/signals-core";
import { steps } from "./steps";

export const useCanvasStore = () => {
  const color = signal("#1F44F5");
  const strokeWidth = signal(10);
  const currentStepIndex = signal(0);
  const allSteps = signal(steps);
  const takeScreenshot = signal<(() => void) | null>(null);

  const isLast = computed(() => currentStepIndex.value === steps.length - 1);
  const isFirst = computed(() => currentStepIndex.value === 0);

  return {
    color,
    strokeWidth,
    allSteps,
    currentStepIndex,
    isLast,
    isFirst,
    takeScreenshot,
  };
};

export type CanvasStore = ReturnType<typeof useCanvasStore>;
