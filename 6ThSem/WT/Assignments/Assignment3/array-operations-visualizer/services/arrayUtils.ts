
export const customReverse = <T,>(arr: T[]): T[] => {
  const newArr: T[] = [];
  for (let i = arr.length - 1; i >= 0; i--) {
    newArr.push(arr[i]);
  }
  return newArr;
};

export const linearSearch = (arr: string[], key: string): number => {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === key) {
      return i;
    }
  }
  return -1;
};

export const bubbleSort = (arr: number[]): number[] => {
  const n = arr.length;
  if (n <= 1) return arr;
  const sortedArr = [...arr];
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (sortedArr[j] > sortedArr[j + 1]) {
        [sortedArr[j], sortedArr[j + 1]] = [sortedArr[j + 1], sortedArr[j]];
      }
    }
  }
  return sortedArr;
};

const merge = (left: number[], right: number[]): number[] => {
  let resultArray: number[] = [], leftIndex = 0, rightIndex = 0;

  while (leftIndex < left.length && rightIndex < right.length) {
    if (left[leftIndex] < right[rightIndex]) {
      resultArray.push(left[leftIndex]);
      leftIndex++;
    } else {
      resultArray.push(right[rightIndex]);
      rightIndex++;
    }
  }

  return resultArray
    .concat(left.slice(leftIndex))
    .concat(right.slice(rightIndex));
};

export const mergeSort = (arr: number[]): number[] => {
  if (arr.length <= 1) {
    return arr;
  }
  const middle = Math.floor(arr.length / 2);
  const left = arr.slice(0, middle);
  const right = arr.slice(middle);

  return merge(mergeSort(left), mergeSort(right));
};

export const stringBubbleSort = (arr: string[]): string[] => {
    const n = arr.length;
    if (n <= 1) return arr;
    const sortedArr = [...arr];
    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            if (sortedArr[j].localeCompare(sortedArr[j + 1]) > 0) {
                [sortedArr[j], sortedArr[j + 1]] = [sortedArr[j + 1], sortedArr[j]];
            }
        }
    }
    return sortedArr;
}

// --- VISUALIZATION SORTING ALGORITHMS ---

export type SortStep = {
    array: number[];
    highlight: number[];
    sorted: number[];
};

export const bubbleSortWithSteps = (arr: number[]): SortStep[] => {
    const steps: SortStep[] = [];
    const a = [...arr];
    const n = a.length;
    let sortedIndices: number[] = [];

    steps.push({ array: [...a], highlight: [], sorted: [] });

    for (let i = n - 1; i > 0; i--) {
        let swapped = false;
        for (let j = 0; j < i; j++) {
            steps.push({ array: [...a], highlight: [j, j + 1], sorted: [...sortedIndices] });
            if (a[j] > a[j + 1]) {
                [a[j], a[j + 1]] = [a[j + 1], a[j]];
                swapped = true;
                steps.push({ array: [...a], highlight: [j, j + 1], sorted: [...sortedIndices] });
            }
        }
        sortedIndices.push(i);
        if (!swapped) {
            const remaining = Array.from({length: i}, (_, k) => k);
            sortedIndices.push(...remaining);
            break;
        }
    }
    steps.push({ array: [...a], highlight: [], sorted: Array.from(Array(n).keys()) });
    return steps;
};


export const mergeSortWithSteps = (arr: number[]): SortStep[] => {
    const steps: SortStep[] = [];
    const n = arr.length;
    if (n <= 1) return [];
    
    let a = [...arr];
    steps.push({ array: [...a], highlight: [], sorted: [] });

    // Use a temporary array for merging
    let b = new Array(n);

    for (let size = 1; size < n; size = 2 * size) {
        for (let leftStart = 0; leftStart < n - 1; leftStart += 2 * size) {
            const mid = Math.min(leftStart + size - 1, n - 1);
            const rightEnd = Math.min(leftStart + 2 * size - 1, n - 1);
            
            let i = leftStart;
            let j = mid + 1;
            let k = leftStart;

            while (i <= mid && j <= rightEnd) {
                steps.push({ array: [...a], highlight: [i, j], sorted: [] });
                if (a[i] <= a[j]) {
                    b[k++] = a[i++];
                } else {
                    b[k++] = a[j++];
                }
            }
            
            while (i <= mid) {
                b[k++] = a[i++];
            }
            
            while (j <= rightEnd) {
                b[k++] = a[j++];
            }

            for(let m = leftStart; m <= rightEnd; m++) {
                a[m] = b[m];
            }
            steps.push({ array: [...a], highlight: Array.from({length: rightEnd - leftStart + 1}, (_, x) => leftStart + x), sorted: [] });
        }
    }
    
    steps.push({ array: [...a], highlight: [], sorted: Array.from({length: n}, (_, i) => i) });
    return steps;
};
