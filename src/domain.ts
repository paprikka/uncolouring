export type PathSegment = {
  id: number;
  points: number[][];
  color: string;
  strokeWidth: number;
};

export type WithTarget<Event, Target> = Event & { currentTarget: Target };
