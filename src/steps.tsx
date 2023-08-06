import { Step } from "./domain";

import img0 from "./assets/img_0.webp";
import img1 from "./assets/img_1.webp";
import img10 from "./assets/img_10.webp";
import img1empty from "./assets/img_1_empty.webp";
import img2 from "./assets/img_2.webp";
import img3 from "./assets/img_3.webp";
import img4 from "./assets/img_4.webp";
import img5 from "./assets/img_5.webp";
import img6 from "./assets/img_6.webp";
import img7 from "./assets/img_7.webp";
import img8 from "./assets/img_8.webp";
import img9 from "./assets/img_9.webp";
import img13 from "./assets/last.jpeg";
import img12 from "./assets/mother.png";
import img11 from "./assets/not-mother.jpeg";

export const steps: Step[] = [
  {
    title: (
      <>
        <h1>Hi, this is the Uncolouring Book!</h1>
        <p>(tap 👉🏼 to continue )</p>
      </>
    ),
    pathSegments: [],
    background: {
      src: img0,
      size: [2480, 3508],
    },
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
    background: {
      src: img1empty,
      size: [2480, 3508],
    },
  },
  {
    title: (
      <>
        <h1>Use your imagination!</h1>
      </>
    ),
    pathSegments: [],
    background: {
      src: img1,
      size: [2480, 3508],
    },
  },
  {
    title: (
      <>
        <h1>A cloud-filled sky</h1>
        <p>What fantastic creatures lie within these clouds?</p>
      </>
    ),
    pathSegments: [],
    background: {
      src: img2,
      size: [2480, 3508],
    },
  },
  {
    title: "Sun",
    pathSegments: [],
    background: {
      src: img3,
      size: [2480, 3508],
    },
  },
  {
    title: "Banana",
    pathSegments: [],
    background: {
      src: img4,
      size: [2480, 3508],
    },
  },
  {
    title: "Cucumber",
    pathSegments: [],
    background: {
      src: img5,
      size: [2480, 3508],
    },
  },
  {
    title: "pickle",
    pathSegments: [],
    background: {
      src: img6,
      size: [2480, 3508],
    },
  },
  {
    title: "Pickle",
    pathSegments: [],
    background: {
      src: img7,
      size: [2480, 3508],
    },
  },
  {
    title: "Pickle III",
    pathSegments: [],
    background: {
      src: img8,
      size: [2480, 3508],
    },
  },
  {
    title: "Mother",
    pathSegments: [],
    background: {
      src: img9,
      size: [2480, 3508],
    },
  },
  {
    title: "Two people in Westfield carrying black balloons",
    pathSegments: [],
    background: {
      src: img10,
      size: [2480, 3508],
    },
  },
  {
    title: "She doesn't love you",
    pathSegments: [],
    background: { src: img11, size: [612, 421] },
  },
  {
    title: "Tell her",
    pathSegments: [],
    background: { src: img12, size: [860, 927] },
  },
  {
    title: "I said tell her",
    pathSegments: [],
    background: { src: img13, size: [1200, 807] },
  },
];
