import { useEffect } from "preact/hooks";
import { useSignal } from "@preact/signals";

export const useScreenSize = () => {
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

  return rect;
};
