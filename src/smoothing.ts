const WINDOW = 5;
/** Detections without a note before the reading is dropped. */
const HOLD = 4;

export interface Smoother {
  /** Takes the latest detection (null when no note) and returns the reading to show. */
  push(hz: number | null): number | null;
}

/** Steadies a stream of detected pitches: median of the last few (a stray reading never wins), a short hold, then back to waiting. */
export function createSmoother(): Smoother {
  let history: number[] = [];
  let missed = 0;

  return {
    push(hz) {
      if (hz === null) {
        missed++;
        if (missed > HOLD) history = [];
      } else {
        missed = 0;
        history.push(hz);
        if (history.length > WINDOW) history.shift();
      }
      return history.length === 0 ? null : sortedMedian(history);
    },
  };
}

function sortedMedian(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
}
