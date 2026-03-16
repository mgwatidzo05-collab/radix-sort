import { SortStep } from '../types';

export function getRadixSortSteps(inputArray: number[]): SortStep[] {
  const steps: SortStep[] = [];
  let array = [...inputArray];
  steps.push({ type: 'START', array: [...array] });

  if (array.length === 0) return steps;

  const max = Math.max(...array);
  steps.push({ type: 'FIND_MAX', max, array: [...array] });

  let digitPlace = 1;
  while (Math.floor(max / digitPlace) > 0) {
    steps.push({ type: 'PREPARE_DIGIT', digitPlace, array: [...array] });

    const buckets: number[][] = Array.from({ length: 10 }, () => []);
    
    for (let i = 0; i < array.length; i++) {
      const digit = Math.floor((array[i] / digitPlace) % 10);
      buckets[digit].push(array[i]);
      
      steps.push({ 
        type: 'DISTRIBUTE', 
        digitPlace, 
        buckets: buckets.map(b => [...b]), 
        currentIdx: i,
        array: [...array]
      });
    }

    // Collect back
    let newArray: number[] = [];
    for (let i = 0; i < 10; i++) {
      newArray = [...newArray, ...buckets[i]];
    }
    array = newArray;
    
    steps.push({ 
      type: 'COLLECT', 
      digitPlace, 
      array: [...array],
      buckets: buckets.map(b => [...b])
    });

    digitPlace *= 10;
  }

  steps.push({ type: 'FINISHED', array: [...array] });
  return steps;
}
