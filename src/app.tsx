import { useComputed, useSignal } from "@preact/signals";
import c from "classnames";
import styles from "./app.module.css";
import { useCanvasStore } from "./canvas-store";
import { Button } from "./components/button";
import { Canvas } from "./components/canvas";
import { PathSegment, Step } from "./domain";
import { usePlomk } from "./plomk";
import { ColorPicker } from "./components/color-picker";
import { usePreloadSteps } from "./steps";

const canvasStore = useCanvasStore();
export function App() {
  usePlomk();
  usePreloadSteps();
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
          <Button size="s" onClick={() => (scratch.value = [])}>
            CLR
          </Button>
          <Button
            onClick={() => {
              if (isLast.value) return gotoStepIndex(3);
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
