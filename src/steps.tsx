import { Step } from "./domain";

import img0 from "./assets/img_0.webp";
import img1 from "./assets/img_1.webp";
import img1empty from "./assets/img_1_empty.webp";
import img2 from "./assets/img_2.webp";
import img3 from "./assets/img_3.webp";
import img4 from "./assets/img_4.webp";
import img5 from "./assets/img_5.webp";
import img6 from "./assets/img_6.webp";
import img7 from "./assets/img_7.webp";
import img8 from "./assets/img_8.webp";
import img9 from "./assets/img_9.webp";
import img10 from "./assets/img_10.webp";
import img11 from "./assets/not-mother.jpeg";
import img12 from "./assets/mother.png";
import img13 from "./assets/last.jpeg";
import { useEffect } from "preact/hooks";

export const steps: Step[] = [
  {
    title: (
      <>
        <h1>Hi, this is the Uncolouring Book!</h1>
        <p>(tap 👉🏼 to continue )</p>
      </>
    ),
    pathSegments: [],
    background: img0,
  },
  {
    title: (
      <>
        <h1>Rules of the game</h1>
        <ol>
          <li>Add strokes to shapes to give them meaning.</li>
          <li>You can draw with your fingers or mouse.</li>
          <li>
            Don't worry about skipping pictures. Hit 👉🏼 to find the one you
            like!
          </li>
          <li>...and most importantly...</li>
        </ol>
      </>
    ),
    pathSegments: [],
    background: img1empty,
  },
  {
    title: (
      <>
        <h1>Use your imagination!</h1>
      </>
    ),
    pathSegments: [],
    background: img1,
  },
  {
    title: (
      <>
        <h1>A cloud-filled sky</h1>
        <p>What fantastic creatures lie within these clouds?</p>
      </>
    ),
    pathSegments: [],
    background: img2,
  },
  { title: "Sun", pathSegments: [], background: img3 },
  { title: "Banana", pathSegments: [], background: img4 },
  { title: "Cucumber", pathSegments: [], background: img5 },
  { title: "pickle", pathSegments: [], background: img6 },
  { title: "Pickle", pathSegments: [], background: img7 },
  { title: "Pickle III", pathSegments: [], background: img8 },
  { title: "Mother", pathSegments: [], background: img9 },
  {
    title: "Two people in Westfield carrying black balloons",
    pathSegments: [],
    background: img10,
  },
  { title: "She doesn't love you", pathSegments: [], background: img11 },
  {
    title: "Tell her",
    pathSegments: [],
    background: img12,
  },
  { title: "I said tell her", pathSegments: [], background: img13 },
];

export const usePreloadSteps = () => {
  useEffect(() => {
    const preloadLinks = steps
      .filter((step) => !!step.background)
      .map((step) => {
        const el = document.createElement("link");
        el.rel = "preload";
        el.href = step.background!;
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
