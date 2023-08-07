import { useComputed, useSignal, useSignalEffect } from "@preact/signals";
import c from "classnames";
import { useState } from "preact/hooks";
import styles from "./app.module.css";
import { useCanvasStore } from "./canvas-store";
import { Button } from "./components/button";
import { Canvas } from "./components/canvas";
import { ColorPicker } from "./components/color-picker";
import { PathSegment, Step } from "./domain";
import { usePlomk } from "./plomk";
import { usePreloadSteps } from "./use-preload-steps";

const OhNo = () => {
  const isSelected = useSignal(false);
  useSignalEffect(() => {
    if (isSelected.value) setTimeout(() => (isSelected.value = false), 600);
  });

  return (
    <main class={styles.ohNo}>
      <label htmlFor="#remember-me">
        <input
          type="checkbox"
          id="remember-me"
          checked={isSelected.value}
          onInput={() => {
            isSelected.value = true;
          }}
        />
        <span>Remember me</span>
      </label>
    </main>
  );
};

export function App() {
  usePlomk();
  usePreloadSteps();
  const [canvasStore] = useState(useCanvasStore);
  const previewVisible = useSignal(false);
  const { isFirst, isLast, currentStepIndex, strokeWidth, color, allSteps } =
    canvasStore;
  const currentBackground = useComputed(
    () => allSteps.value[currentStepIndex.value].background
  );
  const currentTitle = useComputed(
    () => allSteps.value[currentStepIndex.value].title
  );
  const scratch = useSignal<PathSegment[]>([]);

  const gotoStepIndex = (index: number) => {
    if (index < 0 || index > allSteps.value.length - 1) return;

    // save current scratch
    const updatedAllSteps: Step[] = allSteps.value.map((step, index) => {
      if (index !== currentStepIndex.value) return step;
      return { ...step, pathSegments: scratch.value };
    });

    allSteps.value = updatedAllSteps;

    // goto
    currentStepIndex.value = index;

    // load new scratch
    scratch.value = allSteps.value[index].pathSegments;
  };

  const isNo = useSignal(false);

  if (isNo.value) return <OhNo />;
  return (
    <main class={styles.app}>
      <header>
        <a href="https://sonnet.io/" target="_blank">
          🐐
        </a>
      </header>
      <Canvas
        color={color.value}
        strokeWidth={strokeWidth.value}
        output={scratch}
        title={currentTitle.value}
        background={currentBackground.value}
        stepIndex={currentStepIndex.value}
      />

      <div
        class={c({
          [styles.strokePreview]: true,
          [styles.isVisible]: previewVisible.value,
        })}
        style={`--w: ${strokeWidth}px`}
      />

      <div class={styles.canvasTools}>
        <ColorPicker value={color} />
        <label>
          <input
            type="range"
            min="5"
            max="70"
            value={strokeWidth.value}
            onPointerDown={() => (previewVisible.value = true)}
            onPointerUp={() => (previewVisible.value = false)}
            onInput={(e) =>
              (strokeWidth.value = parseInt(e.currentTarget.value, 10))
            }
          />
          {strokeWidth.value.toString().padStart(2, "0")}
        </label>
      </div>
      <footer>
        <nav>
          <Button
            disabled={isFirst.value}
            onClick={() => gotoStepIndex(currentStepIndex.value - 1)}
          >
            👈
          </Button>
          <Button
            size="s"
            disabled={scratch.value.length === 0}
            onClick={() => (scratch.value = scratch.value.slice(0, -1))}
          >
            undo
          </Button>
          <Button
            size="s"
            disabled={scratch.value.length === 0}
            onClick={() => (scratch.value = [])}
          >
            clear
          </Button>
          <Button
            onClick={() => {
              if (isLast.value) {
                isNo.value = true;
                return;
              }
              gotoStepIndex(currentStepIndex.value + 1);
            }}
          >
            👉🏼
          </Button>
        </nav>
      </footer>
    </main>
  );
}
