import { useEffect } from "preact/hooks";
import { steps } from "./steps";

export const usePreloadSteps = () => {
  useEffect(() => {
    const preloadLinks = steps
      .filter((step) => !!step.background?.size)
      .map((step) => {
        const el = document.createElement("link");
        el.rel = "preload";
        el.href = step.background?.src!;
        el.as = "image";
        el.classList.add("uncolouring-book-preload");
        return el;
      });

    document.head.append(...preloadLinks);

    return () => {
      document.head
        .querySelectorAll(".uncolouring-book-preload")
        .forEach((el) => el.remove());
    };
  }, []);
};
