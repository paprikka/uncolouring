import { useComputed, useSignal } from "@preact/signals";
import c from "classnames";
import styles from "./app.module.css";
import { Canvas } from "./components/canvas";
import { PathSegment } from "./domain";
import { useCanvasStore } from "./canvas-store";
import { Step } from "./domain";

const canvasStore = useCanvasStore();
export function App() {
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

    currentStepIndex.value = index;

    // load new scratch
    scratch.value = allSteps.value[index].pathSegments;
  };

  return (
    <main class={styles.app}>
      <header>
        {/* <h1>Uncolouring book</h1> */}
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
      />

      <div
        class={c({
          [styles.strokePreview]: true,
          [styles.isVisible]: previewVisible.value,
        })}
        style={`--w: ${strokeWidth}px`}
      />
      <footer>
        <nav>
          <button
            disabled={isFirst}
            onClick={() => gotoStepIndex(currentStepIndex.value - 1)}
          >
            👈
          </button>
          <div class={styles.canvasTools}>
            <input
              type="color"
              onInput={(e) => {
                color.value = e.currentTarget.value + "99";
              }}
              value={color.value}
            />
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
            <button
              disabled={scratch.value.length === 0}
              onClick={() => (scratch.value = scratch.value.slice(0, -1))}
            >
              undo
            </button>
            <button onClick={() => (scratch.value = [])}>Clear</button>
          </div>
          <button
            disabled={isLast}
            onClick={() => gotoStepIndex(currentStepIndex.value + 1)}
          >
            👉🏼
          </button>
        </nav>
      </footer>
    </main>
  );
}
