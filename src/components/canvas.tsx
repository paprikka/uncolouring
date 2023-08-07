import { useComputed, useSignal, useSignalEffect } from "@preact/signals";
import type { Signal } from "@preact/signals-core";
import { getStroke } from "perfect-freehand";
import { VNode } from "preact";
import { useEffect, useRef } from "preact/hooks";
import type { PathSegmentRecording, StepBackground } from "../domain";
import { PathSegment } from "../domain";
import styles from "./canvas.module.css";
import { getSvgPathFromStroke } from "./get-svg-path-from-stroke";
import { useScaleFactor } from "./use-scale-factor";
import { useScreenSize } from "./use-screen-size";
import { useRecording } from "./use-recording";

type Props = {
  background?: StepBackground;
  color: string;
  output: Signal<PathSegment[]>;
  recording?: PathSegmentRecording;
  stepIndex: number;
  strokeWidth: number;
  title: string | VNode | VNode[];
};

export const Canvas = ({
  background,
  color,
  output,
  recording,
  stepIndex,
  strokeWidth,
  title,
}: Props) => {
  useEffect(() => {
    timestamps.value = [];
  }, [background]);
  const onDown = (e: PointerEvent) => {
    (e.target as SVGElement).setPointerCapture(e.pointerId);

    timestamps.value = [...timestamps.value, [Date.now()]];
    const { offsetX, offsetY } = canvasOffsets.value;
    output.value = [
      ...output.value,
      {
        id: Date.now(),
        color: color,
        points: [[e.clientX - offsetX, e.clientY - offsetY]],
        strokeWidth: strokeWidth,
        originalScale: scaleFactor.value,
      },
    ];
  };

  const withTimestamps = useComputed(() => {
    return {
      pathSegments: output.value,
      timestamps: timestamps.value,
    };
  });

  useSignalEffect(() => {
    (window as unknown as any).timestamps = withTimestamps.value;
  });

  const timestamps = useSignal<number[][]>([]);

  const onMove = (e: PointerEvent) => {
    if (e.buttons !== 1) return;

    const lastSegment = output.value[output.value.length - 1];
    if (!lastSegment) return;

    const { offsetX, offsetY } = canvasOffsets.value;

    lastSegment.points = [
      ...lastSegment.points,
      [e.clientX - offsetX, e.clientY - offsetY],
    ];
    output.value = [...output.value.slice(0, -1), lastSegment];

    const lastTimestamp = timestamps.value[timestamps.value.length - 1];
    timestamps.value = [
      ...timestamps.value.slice(0, -1),
      [...lastTimestamp, Date.now()],
    ];
  };

  const allSVGPaths = useComputed(() => {
    return output.value.map((segment) => {
      const stroke = getStroke(segment.points, {
        thinning: 0.7,
        streamline: 0.2,
        smoothing: 0.5,
        size: segment.strokeWidth,
      });
      const path = getSvgPathFromStroke(stroke);

      return { segment, path };
    });
  });

  const canvasWidth = 10000;
  const canvasHeight = 10000;
  const canvasElement = useRef<SVGSVGElement>(null);
  const canvasOffsets = useScreenSize(canvasElement);

  const sizes = background?.size || [1, 1];
  const scaleFactor = useScaleFactor(sizes[0], sizes[1], 1);

  useRecording(stepIndex, output, recording);

  return (
    <div class={styles.canvas}>
      {background?.src ? (
        <div
          key={`background_${stepIndex}_${background.src}`}
          className={styles.background}
          style={{ backgroundImage: `url(${background.src})` }}
        />
      ) : null}
      <svg
        ref={canvasElement}
        width={canvasWidth}
        height={canvasHeight}
        onPointerDown={onDown}
        onPointerMove={onMove}
        xmlns="http://www.w3.org/2000/svg"
        key={`canvas_${stepIndex}_${background}`}
      >
        {allSVGPaths.value
          .filter((svgPath) => svgPath.segment.points.length)
          .map(({ segment, path }) => (
            <path
              key={segment.id}
              d={path}
              fill={segment.color}
              style={`--s: ${scaleFactor.value / segment.originalScale};`}
            />
          ))}
      </svg>
      <div class={styles.title} key={`title_${stepIndex}_${background}`}>
        <div class={styles.titleContent}>
          {typeof title === "string" ? <h1>{title}</h1> : title}{" "}
        </div>
      </div>
    </div>
  );
};
