import { PathSegment } from "../domain";
import styles from "./canvas.module.css";
import { useSignal, useComputed } from "@preact/signals";
import { getSvgPathFromStroke } from "./get-svg-path-from-stroke";
import { getStroke } from "perfect-freehand";
import { useEffect } from "preact/hooks";

type Props = { title: string; color: string; strokeWidth: number };

export const Canvas = ({ title, color, strokeWidth }: Props) => {
  const rect = useSignal(document.documentElement.getBoundingClientRect());
  useEffect(() => {
    const onResize = () => {
      rect.value = document.documentElement.getBoundingClientRect();
    };

    addEventListener("resize", onResize);

    return () => {
      removeEventListener("resize", onResize);
    };
  }, []);
  const pathSegments = useSignal<PathSegment[]>([]);

  const onDown = (e: PointerEvent) => {
    (e.target as SVGElement).setPointerCapture(e.pointerId);

    pathSegments.value = [
      ...pathSegments.value,
      {
        id: Date.now(),
        color,
        points: [[e.clientX, e.clientY]],
        strokeWidth,
      },
    ];
  };

  const onMove = (e: PointerEvent) => {
    if (e.buttons !== 1) return;

    const lastSegment = pathSegments.value[pathSegments.value.length - 1];
    if (!lastSegment) return;

    lastSegment.points = [...lastSegment.points, [e.clientX, e.clientY]];
    pathSegments.value = [...pathSegments.value.slice(0, -1), lastSegment];
  };

  const allSVGPaths = useComputed(() => {
    return pathSegments.value.map((segment) => {
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

  // TODO : remove

  return (
    <div class={styles.canvas}>
      <svg
        width={rect.value.width}
        height={rect.value.height}
        onPointerDown={onDown}
        onPointerMove={onMove}
        xmlns="http://www.w3.org/2000/svg"
      >
        {allSVGPaths.value
          .filter((svgPath) => svgPath.segment.points.length > 1)
          .map((svgPath) => (
            <path
              key={svgPath.segment.id}
              d={svgPath.path}
              fill={svgPath.segment.color}
            />
          ))}
      </svg>
      <p class={styles.title}>{title}</p>
    </div>
  );
};
