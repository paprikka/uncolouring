import { useComputed, useSignal, useSignalEffect } from "@preact/signals";
import c from "classnames";
import { useState } from "preact/hooks";
import styles from "./app.module.css";
import { useCanvasStore } from "./canvas-store";
import { Canvas } from "./components/canvas";
import { ColorPicker } from "./components/color-picker";
import { Header } from "./components/header";
import { Icons } from "./components/icons";
import { ImageButton } from "./components/image-button";
import { OhNo } from "./components/ohno";
import { isActive as isActivelyRecording } from "./components/use-recording";
import { PathSegment, Step } from "./domain";
import { usePlomk } from "./plomk";
import { takeScreenshot } from "./screenshot";
import { track } from "./track";
import { usePreloadSteps } from "./use-preload-steps";

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
  const currentRecording = useComputed(
    () => allSteps.value[currentStepIndex.value].recording
  );
  const scratch = useSignal<PathSegment[]>(
    allSteps.value[currentStepIndex.value].pathSegments
  );

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

  useSignalEffect(() => {
    track(`step:${currentStepIndex.value}`);
  });

  const isUIEnabled = !isActivelyRecording.value;
  const isNo = useSignal(false);
  if (isNo.value) return <OhNo />;

  return (
    <main class={styles.app}>
      {isActivelyRecording.value ? <div class={styles.uiOverlay} /> : null}
      <Header />
      <Canvas
        color={color.value}
        strokeWidth={strokeWidth.value}
        output={scratch}
        title={currentTitle.value}
        background={currentBackground.value}
        stepIndex={currentStepIndex.value}
        recording={currentRecording.value}
      />

      <div
        class={c({
          [styles.strokePreview]: true,
          [styles.isVisible]: previewVisible.value,
        })}
        style={`--w: ${strokeWidth}px`}
      />

      <div class={styles.canvasTools}>
        <ColorPicker value={color} disabled={!isUIEnabled} />
        <label>
          <input
            disabled={!isUIEnabled}
            type="range"
            min="3"
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
          <ImageButton
            disabled={isFirst.value || !isUIEnabled}
            onClick={() => gotoStepIndex(currentStepIndex.value - 1)}
            imageSrc={Icons.prev}
            label="Go back"
          />

          <ImageButton
            disabled={scratch.value.length === 0 || !isUIEnabled}
            onClick={() => (scratch.value = scratch.value.slice(0, -1))}
            imageSrc={Icons.undo}
            label="Undo"
          />
          <ImageButton
            onClick={() => takeScreenshot(document.querySelector("svg")!)}
            imageSrc={Icons.download}
            label="Download"
          />

          <ImageButton
            disabled={scratch.value.length === 0 || !isUIEnabled}
            onClick={() => {
              if (!confirm("Are you sure you want to clear the canvas?"))
                return;
              scratch.value = [];
            }}
            imageSrc={Icons.clear}
            label="Clear canvas"
          />
          <ImageButton
            disabled={!isUIEnabled}
            onClick={() => {
              if (isLast.value) {
                isNo.value = true;
                return;
              }
              gotoStepIndex(currentStepIndex.value + 1);
            }}
            imageSrc={Icons.next}
            label="Go forward"
          />
        </nav>
      </footer>
    </main>
  );
}
