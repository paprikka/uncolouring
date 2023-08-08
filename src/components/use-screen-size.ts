import { useEffect } from "preact/hooks";
import { useSignal } from "@preact/signals";
import { Ref } from "preact/hooks";

export const useScreenSize = (element: Ref<SVGSVGElement>) => {
  const offsets = useSignal({
    offsetX: 0,
    offsetY: 0,
  });

  useEffect(() => {
    const onResize = () => {
      if (!element?.current) return;
      const rect = element.current.getBoundingClientRect();
      offsets.value = {
        offsetX: rect.left,
        offsetY: rect.top,
      };
    };

    addEventListener("resize", onResize);

    // iPad fix/hack
    const timer = setInterval(onResize, 1000);

    return () => {
      clearInterval(timer);
      removeEventListener("resize", onResize);
    };
  }, []);

  return offsets;
};
