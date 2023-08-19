// This code is VERY heavily inspired by tldraw:
// https://github.com/tldraw/tldraw/blob/main/packages/tldraw/src/lib/utils/export.ts#L26
// It's a stripped down and simplified version of tldraw's export code, since our needs are much simpler here.

const canvasToBlob = (canvas: HTMLCanvasElement) =>
  new Promise<Blob | null>((resolve) =>
    canvas.toBlob((blob) => {
      if (!blob) return resolve(null);
      resolve(blob);
    }, "image/png")
  );

const svgToCanvas = (svgElement: SVGElement, dataURI: string) =>
  new Promise<HTMLCanvasElement | null>((resolve) => {
    const image = new Image();
    image.crossOrigin = "anonymous";

    image.onload = async () => {
      // * HACK: the image is not ready immediately, so we wait a bit
      // TODO: drop the magic number
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const canvas = document.createElement("canvas");
      // TODO: take pixel density into account!
      const exportW = window.innerWidth;
      const exportH = window.innerHeight;

      canvas.width = exportW;
      canvas.height = exportH;

      const sX = (svgElement.clientWidth - exportW) / 2;
      const sY = (svgElement.clientHeight - exportH) / 2;

      const ctx = canvas.getContext("2d")!;

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, exportW, exportH);
      ctx.drawImage(image, sX, sY, exportW, exportH, 0, 0, exportW, exportH);

      URL.revokeObjectURL(dataURI);

      resolve(canvas);
    };

    image.onerror = (error) => {
      console.error(error);
      resolve(null);
    };

    image.src = dataURI;
  });

export async function svgToBlob(svgElement: SVGElement) {
  const dataURI = await svgToDataURI(svgElement);

  const canvas = await svgToCanvas(svgElement, dataURI);
  if (!canvas) return null;

  return canvasToBlob(canvas);
}

export async function svgToDataURI(svg: SVGElement) {
  const clone = svg.cloneNode(true) as SVGGraphicsElement;
  clone.setAttribute("encoding", 'UTF-8"');

  const fileReader = new FileReader();
  const imgs = Array.from(clone.querySelectorAll("image")) as SVGImageElement[];

  for (const img of imgs) {
    // TODO: is href instead of xlink:href ok?
    const src = img.getAttribute("href");
    if (!src) continue;
    if (src.startsWith("data:")) continue;

    const blob = await (await fetch(src)).blob();
    const base64 = await new Promise<string>((resolve, reject) => {
      fileReader.onload = () => resolve(fileReader.result as string);
      fileReader.onerror = () => reject(fileReader.error);
      fileReader.readAsDataURL(blob);
    });
    img.setAttribute("href", base64);
  }

  return svgToDataURISync(clone);
}

export function svgToDataURISync(node: SVGElement) {
  const svgStr = new XMLSerializer().serializeToString(node);
  const base64SVG = window.btoa(decodeURIComponent(encodeURIComponent(svgStr)));
  return `data:image/svg+xml;base64,${base64SVG}`;
}

export const takeScreenshot = async (svgElement: SVGSVGElement) => {
  console.log("Taking screenshot...");
  svgToBlob(svgElement).then((blob) => {
    if (blob) {
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `screenshot_${Date.now()}.png`;
      link.click();

      URL.revokeObjectURL(url);
    }
  });
};
