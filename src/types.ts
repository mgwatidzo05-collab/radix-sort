export type SortStep = 
  | { type: 'START'; array: number[] }
  | { type: 'FIND_MAX'; max: number; array: number[] }
  | { type: 'PREPARE_DIGIT'; digitPlace: number; array: number[] }
  | { type: 'DISTRIBUTE'; digitPlace: number; buckets: number[][]; currentIdx: number; array: number[] }
  | { type: 'COLLECT'; digitPlace: number; array: number[]; buckets: number[][] }
  | { type: 'FINISHED'; array: number[] };

export interface VisualizerState {
  array: number[];
  buckets: number[][];
  currentDigitPlace: number;
  maxNumber: number | null;
  stepIndex: number;
  isSorting: boolean;
  status: string;
  highlightIdx: number | null;
}
