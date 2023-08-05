import { VNode } from "preact";

export type PathSegment = {
  id: number;
  points: number[][];
  color: string;
  strokeWidth: number;
};

export type Step = {
  title: string | VNode | VNode[];
  pathSegments: PathSegment[];
  background?: string;
};

export type WithTarget<Event, Target> = Event & { currentTarget: Target };
