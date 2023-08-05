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
        <h1>Uncolouring book</h1>
      </header>
      <Canvas
        color={color.value}
        strokeWidth={strokeWidth.value}
        output={scratch}
        title={currentTitle.value}
      />

      <div
        class={c({
          [styles.strokePreview]: true,
          [styles.isVisible]: previewVisible.value,
        })}
        style={`--w: ${strokeWidth.value}px`}
      />
      <footer>
        <nav>
          <button
            disabled={isFirst}
            onClick={() => gotoStepIndex(currentStepIndex.value - 1)}
          >
            👈
          </button>
          <input
            type="color"
            onInput={(e) => {
              color.value = e.currentTarget.value + "99";
            }}
            value={color.value}
          />
          <input
            type="range"
            min="5"
            max="70"
            onPointerDown={() => (previewVisible.value = true)}
            onPointerUp={() => (previewVisible.value = false)}
            onInput={(e) =>
              (strokeWidth.value = parseInt(e.currentTarget.value, 10))
            }
          />

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
