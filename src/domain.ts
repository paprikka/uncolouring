import { VNode } from "preact";

export type PathSegment = {
  id: number;
  points: number[][];
  color: string;
  strokeWidth: number;
  originalScale: number;
};

export type StepBackground = {
  src: string;
  size: [number, number];
};

export type Step = {
  title: string | VNode | VNode[];
  pathSegments: PathSegment[];
  background?: StepBackground;
};

export type WithTarget<Event, Target> = Event & { currentTarget: Target };
