import { useComputed } from "@preact/signals";
import type { Signal } from "@preact/signals-core";
import { getStroke } from "perfect-freehand";
import { VNode } from "preact";
import { useRef } from "preact/hooks";
import { PathSegment } from "../domain";
import styles from "./canvas.module.css";
import { getSvgPathFromStroke } from "./get-svg-path-from-stroke";
import { useScreenSize } from "./use-screen-size";

type Props = {
  title: string | VNode | VNode[];
  color: string;
  strokeWidth: number;
  background?: string;
  output: Signal<PathSegment[]>;
  stepIndex: number;
};

export const Canvas = ({
  title,
  color,
  output,
  strokeWidth,
  background,
  stepIndex,
}: Props) => {
  const onDown = (e: PointerEvent) => {
    (e.target as SVGElement).setPointerCapture(e.pointerId);

    const { offsetX, offsetY } = canvasOffsets.value;
    output.value = [
      ...output.value,
      {
        id: Date.now(),
        color: color,
        points: [[e.clientX - offsetX, e.clientY - offsetY]],
        strokeWidth: strokeWidth,
      },
    ];
  };

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

  return (
    <div class={styles.canvas}>
      {background ? (
        <div
          key={`background_${stepIndex}_${background}`}
          className={styles.background}
          style={{ backgroundImage: `url(${background})` }}
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
            <path key={segment.id} d={path} fill={segment.color} />
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
