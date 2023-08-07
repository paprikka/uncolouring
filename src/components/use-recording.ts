import { Signal } from "@preact/signals-core";
import { useEffect } from "preact/hooks";
import { PathSegment, PathSegmentRecording } from "../domain";
import { useSignal } from "@preact/signals";

export const useRecording = (
  stepIndex: number,
  output: Signal<PathSegment[]>,
  recording?: PathSegmentRecording
) => {
  const isActive = useSignal(false);

  useEffect(() => {
    if (!recording) return;

    let rafID: number | null = null;
    const rafPromise = () =>
      new Promise((resolve) => (rafID = requestAnimationFrame(resolve)));

    console.log("poodle");
    output.value = [];

    const run = async () => {
      let segmentIndex = 0;
      const firstTimestamp = recording.timestamps[0][0];
      const lastTimestamp = recording.timestamps.at(-1)?.at(-1);
      if (!firstTimestamp || !lastTimestamp) return;
      console.log("duration", lastTimestamp - firstTimestamp);
      isActive.value = true;

      const adjustedTimestamps = recording.timestamps.map(
        (segmentTimestamps) => {
          return segmentTimestamps.map(
            (timestamp) =>
              (timestamp - firstTimestamp) * (recording?.timeScale || 1)
          );
        }
      );

      console.log("running");
      const startedAt = Date.now();
      while (segmentIndex < adjustedTimestamps.length) {
        console.log("Draw segment", segmentIndex);
        const segment = recording.pathSegments[segmentIndex];
        const points = segment.points;
        const timestamps = adjustedTimestamps[segmentIndex];

        let pointsToDraw: number[][] = [];
        output.value = [...output.value, { ...segment, points: [] }];

        while (pointsToDraw.length < points.length) {
          const now = Date.now();
          const elapsed = now - startedAt;
          const activeTimestamps = timestamps.filter((t) => t <= elapsed);

          pointsToDraw = points.slice(0, activeTimestamps.length);

          output.value = [
            ...output.value.slice(0, -1),
            {
              ...segment,
              points: pointsToDraw,
            },
          ];

          await rafPromise();
        }

        segmentIndex++;
      }

      isActive.value = false;
    };

    console.log("run");
    run();

    return () => {
      if (!rafID) return;
      cancelAnimationFrame(rafID);
    };
  }, [stepIndex, recording]);

  return isActive;
};
