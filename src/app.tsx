import { useMemo, useState } from "preact/hooks";
import styles from "./app.module.css";
import { steps } from "./steps";
import c from "classnames";
import { Canvas } from "./components/canvas";

export function App() {
  const [color, setColor] = useState("#000000");
  const [strokeWidth, setStrokeWidth] = useState(10);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const currentStep = useMemo(
    () => steps[currentStepIndex],
    [currentStepIndex]
  );

  return (
    <main class={styles.app}>
      <header>
        <h1>Uncolouring book</h1>
      </header>
      <Canvas
        title={currentStep.title}
        color={color}
        strokeWidth={strokeWidth}
      />

      <div
        class={c({
          [styles.strokePreview]: true,
          [styles.isVisible]: previewVisible,
        })}
        style={`--w: ${strokeWidth}px`}
      />
      <footer>
        <nav>
          <button
            disabled={!currentStepIndex}
            onClick={() => setCurrentStepIndex(currentStepIndex - 1)}
          >
            👈
          </button>
          <input
            type="color"
            onChange={(e) => {
              setColor(e.currentTarget.value);
            }}
            value={color}
          />
          <input
            type="range"
            min="5"
            max="70"
            onPointerDown={() => setPreviewVisible(true)}
            onPointerUp={() => setPreviewVisible(false)}
            onInput={(e) => setStrokeWidth(parseInt(e.currentTarget.value, 10))}
          />

          <button
            disabled={currentStepIndex === steps.length - 1}
            onClick={() => setCurrentStepIndex(currentStepIndex + 1)}
          >
            👉🏼
          </button>
        </nav>
      </footer>
    </main>
  );
}
