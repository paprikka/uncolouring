import { useComputed, useSignalEffect } from "@preact/signals";
import type { Signal } from "@preact/signals-core";
import { getStroke } from "perfect-freehand";
import { VNode } from "preact";
import { useEffect, useRef } from "preact/hooks";
import type { StepBackground } from "../domain";
import { PathSegment } from "../domain";
import styles from "./canvas.module.css";
import { getSvgPathFromStroke } from "./get-svg-path-from-stroke";
import { useScaleFactor } from "./use-scale-factor";
import { useScreenSize } from "./use-screen-size";
import mother from "../assets/not-mother.jpeg";
type Props = {
  title: string | VNode | VNode[];
  color: string;
  strokeWidth: number;
  background?: StepBackground;
  output: Signal<PathSegment[]>;
  stepIndex: number;
  takeScreenshot: Signal<(() => void) | null>;
};

import { toPng, toJpeg } from "html-to-image";

const downloadURI = (dataURI: string) => {
  const filename = `uncolouring_${Date.now()}.png`;

  const a = document.createElement("a");
  a.download = filename;
  a.href = dataURI;
  a.click();
};

async function imageToBase64(url: string): Promise<string> {
  const response = await fetch(url); // Fetch the image
  const blob = await response.blob(); // Get the image as a Blob
  return new Promise((resolve) => {
    const reader = new FileReader(); // Create a FileReader
    reader.onloadend = () => resolve(reader.result as string); // Resolve the promise with the Base64 data
    reader.readAsDataURL(blob); // Read the Blob as a Data URL
  });
}

const svgToDataURI = async (baseSVG: SVGSVGElement) => {
  // clone the svg

  const svg = baseSVG; // baseSVG.cloneNode(true) as SVGSVGElement;

  await Promise.all(
    Array.from(svg.querySelectorAll("image")).map((image) => {
      // image.getAttributeNS('http://www.w3.org/1999/xlink', 'href', 'path/to/image.png');

      return imageToBase64(image.getAttribute("href")!).then((dataURI) => {
        image.setAttribute("href", dataURI);
      });
    })
  );

  const markup = new XMLSerializer().serializeToString(svg);
  const blob = new Blob([markup], { type: "image/svg+xml;charset=utf-8" });

  const url = URL.createObjectURL(blob);
  const image = new Image();
  image.width = svg.width.baseVal.value;
  image.height = svg.height.baseVal.value;
  image.src = url;

  return new Promise((resolve, reject) => {
    image.onload = () => {
      resolve(image);
    };
  }).then(() => {
    const canvas = document.createElement("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const ctx = canvas.getContext("2d");
    ctx?.drawImage(image, 0, 0, image.width, image.height);
    URL.revokeObjectURL(url);

    return canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
  });
};
export const Canvas = ({
  title,
  color,
  output,
  strokeWidth,
  background,
  stepIndex,
  takeScreenshot,
}: Props) => {
  useEffect(() => {
    if (!svgElement.current) {
      takeScreenshot.value = null;
      return;
    }
    const screenshotHandler = () => {
      if (!svgElement.current) return;

      svgToDataURI(svgElement.current)
        .then(downloadURI)
        .catch((error) => {
          console.log({ error });
          window.alert(
            `Sorry, seems like I couldn't download the image.\n\n Perhaps try to take a screenshot instead?`
          );
        });
    };
    takeScreenshot.value = screenshotHandler;
  }, []);
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
        originalScale: scaleFactor.value,
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
  const svgElement = useRef<SVGSVGElement>(null);
  const containerElement = useRef<HTMLDivElement>(null);
  const canvasOffsets = useScreenSize(svgElement);

  const sizes = background?.size || [1, 1];
  const scaleFactor = useScaleFactor(sizes[0], sizes[1], 1);
  return (
    <div data-printable="true" class={styles.canvas} ref={containerElement}>
      {background?.src ? (
        <div
          key={`background_${stepIndex}_${background.src}`}
          className={styles.background}
          style={{ backgroundImage: `url(${background.src})` }}
        />
      ) : null}
      <svg
        data-printable="true"
        ref={svgElement}
        width={canvasWidth}
        height={canvasHeight}
        onPointerDown={onDown}
        onPointerMove={onMove}
        xmlns="http://www.w3.org/2000/svg"
        key={`canvas_${stepIndex}_${background}`}
      >
        <image x="5000" y="5000" width={100} height={100} xlinkHref={mother} />
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

      <img
        src={mother}
        alt=""
        style={{
          position: "absolute",
          zIndex: 1000,
          width: 100,
          height: 100,
          objectFit: "contain",
        }}
      />
      <div class={styles.title} key={`title_${stepIndex}_${background}`}>
        <div class={styles.titleContent}>
          {typeof title === "string" ? <h1>{title}</h1> : title}{" "}
        </div>
      </div>
    </div>
  );
};
