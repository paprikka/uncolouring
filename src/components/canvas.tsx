import { useComputed } from "@preact/signals";
import type { Signal } from "@preact/signals-core";
import { getStroke } from "perfect-freehand";
import { PathSegment } from "../domain";
import styles from "./canvas.module.css";
import { getSvgPathFromStroke } from "./get-svg-path-from-stroke";
import { useScreenSize } from "./use-screen-size";
import { VNode } from "preact";

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
  const rect = useScreenSize();

  const onDown = (e: PointerEvent) => {
    (e.target as SVGElement).setPointerCapture(e.pointerId);

    output.value = [
      ...output.value,
      {
        id: Date.now(),
        color: color,
        points: [[e.clientX, e.clientY]],
        strokeWidth: strokeWidth,
      },
    ];
  };

  const onMove = (e: PointerEvent) => {
    if (e.buttons !== 1) return;

    const lastSegment = output.value[output.value.length - 1];
    if (!lastSegment) return;

    lastSegment.points = [...lastSegment.points, [e.clientX, e.clientY]];
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
        width={rect.value.width}
        height={rect.value.height}
        onPointerDown={onDown}
        onPointerMove={onMove}
        xmlns="http://www.w3.org/2000/svg"
        key={`canvas_${stepIndex}_${background}`}
      >
        {allSVGPaths.value
          .filter((svgPath) => svgPath.segment.points.length > 1)
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
