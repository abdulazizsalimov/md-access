import { PAGE_DIMENSIONS } from './pageCalculations';

export const createMeasureElement = (element: HTMLElement): HTMLElement => {
  const measureEl = document.createElement('div');
  measureEl.style.cssText = element.style.cssText;
  measureEl.style.width = `${PAGE_DIMENSIONS.width - PAGE_DIMENSIONS.margins.left - PAGE_DIMENSIONS.margins.right}px`;
  measureEl.style.position = 'absolute';
  measureEl.style.visibility = 'hidden';
  measureEl.style.height = 'auto';
  measureEl.style.whiteSpace = 'pre-wrap';
  measureEl.style.wordBreak = 'break-word';
  document.body.appendChild(measureEl);
  return measureEl;
};

export const shouldCreateNewPage = (element: HTMLElement, maxHeight: number): boolean => {
  return element.scrollHeight > maxHeight;
};

export const getLastVisiblePosition = (
  element: HTMLElement, 
  content: string, 
  maxHeight: number
): number => {
  const measureEl = createMeasureElement(element);
  let start = 0;
  let end = content.length;
  let lastGoodPosition = 0;

  // Binary search for the last position that fits
  while (start <= end) {
    const mid = Math.floor((start + end) / 2);
    measureEl.innerHTML = content.substring(0, mid);
    
    if (measureEl.scrollHeight <= maxHeight) {
      lastGoodPosition = mid;
      start = mid + 1;
    } else {
      end = mid - 1;
    }
  }

  // Clean up measurement element
  document.body.removeChild(measureEl);

  // Find the nearest line break before the last good position
  const nearestLineBreak = content.lastIndexOf('\n', lastGoodPosition);
  if (nearestLineBreak > lastGoodPosition - 100) {
    return nearestLineBreak;
  }

  // If no suitable line break found, find the last word boundary
  const lastSpace = content.lastIndexOf(' ', lastGoodPosition);
  if (lastSpace > lastGoodPosition - 20) {
    return lastSpace;
  }

  return lastGoodPosition;
};