import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";

export const useScaleFactor = (
  srcWidth: number,
  srcHeight: number,
  baseScaleFactor = 1
) => {
  const scaleFactor = useSignal(baseScaleFactor);

  useEffect(() => {
    const onResize = () => {
      scaleFactor.value = Math.min(
        window.innerWidth / srcWidth,
        window.innerHeight / srcHeight
      );
    };

    addEventListener("resize", onResize);
    const timer = setTimeout(onResize, 0);

    return () => {
      removeEventListener("resize", onResize);
      clearTimeout(timer);
    };
  }, [srcWidth, srcHeight]);

  return scaleFactor;
};
