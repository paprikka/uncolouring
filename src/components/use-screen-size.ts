import { useEffect } from "preact/hooks";
import { useSignal } from "@preact/signals";

export const useScreenSize = () => {
  const rect = useSignal(document.documentElement.getBoundingClientRect());
  useEffect(() => {
    const onResize = () => {
      rect.value = document.documentElement.getBoundingClientRect();
    };

    addEventListener("resize", onResize);

    // iPad fix/hack
    const timer = setTimeout(onResize, 0);

    return () => {
      clearTimeout(timer);
      removeEventListener("resize", onResize);
    };
  }, []);

  return rect;
};
