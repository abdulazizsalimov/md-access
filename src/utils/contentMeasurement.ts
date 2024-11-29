import { PAGE_DIMENSIONS } from './pageCalculations';

export const createMeasurementDiv = (editorStyle: CSSStyleDeclaration) => {
  const tempDiv = document.createElement('div');
  tempDiv.style.cssText = editorStyle.cssText;
  tempDiv.style.width = `${PAGE_DIMENSIONS.width - PAGE_DIMENSIONS.margins.left - PAGE_DIMENSIONS.margins.right}px`;
  tempDiv.style.height = 'auto';
  tempDiv.style.position = 'absolute';
  tempDiv.style.visibility = 'hidden';
  tempDiv.style.whiteSpace = 'pre-wrap';
  tempDiv.style.wordBreak = 'break-word';
  document.body.appendChild(tempDiv);
  return tempDiv;
};

export const measureContentHeight = (div: HTMLDivElement, content: string): number => {
  div.innerHTML = content;
  return div.scrollHeight;
};

export const findContentSplitPoint = (
  content: string,
  maxHeight: number,
  measureFn: (text: string) => number
): { currentContent: string; remainingContent: string } => {
  const lines = content.split('\n');
  let currentContent = '';
  let lastGoodContent = '';
  
  for (let i = 0; i < lines.length; i++) {
    const testContent = currentContent + (currentContent ? '\n' : '') + lines[i];
    const height = measureFn(testContent);
    
    if (height > maxHeight) {
      return {
        currentContent: lastGoodContent,
        remainingContent: lines.slice(i).join('\n')
      };
    }
    
    lastGoodContent = testContent;
    currentContent = testContent;
  }
  
  return {
    currentContent,
    remainingContent: ''
  };
};