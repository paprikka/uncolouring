export type PathSegment = {
  id: number;
  points: number[][];
  color: string;
  strokeWidth: number;
};

export type Step = {
  title: string;
  pathSegments: PathSegment[];
};

export type WithTarget<Event, Target> = Event & { currentTarget: Target };
