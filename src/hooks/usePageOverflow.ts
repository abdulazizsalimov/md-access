import { useCallback, RefObject } from 'react';
import { calculateMaxHeight } from '../utils/pageCalculations';
import { createMeasurementDiv, measureContentHeight, findContentSplitPoint } from '../utils/contentMeasurement';

export const usePageOverflow = (
  fontSize: number,
  editorRefs: RefObject<{ [key: string]: HTMLDivElement | null }>,
  updatePageContent: (pageId: string, content: string) => void,
  addPage: (afterPageId: string, content: string) => string
) => {
  return useCallback((pageId: string, content: string) => {
    const editor = editorRefs.current?.[pageId];
    if (!editor) return false;

    const maxHeight = calculateMaxHeight(fontSize);
    
    // Skip if content height is within limits
    if (editor.scrollHeight <= maxHeight) {
      return false;
    }

    const measureDiv = createMeasurementDiv(editor.style);
    const measure = (text: string) => measureContentHeight(measureDiv, text);

    const { currentContent, remainingContent } = findContentSplitPoint(
      content,
      maxHeight,
      measure
    );

    document.body.removeChild(measureDiv);

    if (remainingContent) {
      // Update current page with content that fits
      updatePageContent(pageId, currentContent);
      
      // Create new page with remaining content
      const nextPageId = addPage(pageId, remainingContent);
      
      // Focus the new page
      requestAnimationFrame(() => {
        const nextEditor = editorRefs.current?.[nextPageId];
        if (nextEditor) {
          nextEditor.focus();
          const range = document.createRange();
          const selection = window.getSelection();
          if (selection) {
            range.selectNodeContents(nextEditor);
            range.collapse(false);
            selection.removeAllRanges();
            selection.addRange(range);
            nextEditor.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      });

      return true;
    }

    return false;
  }, [fontSize, editorRefs, updatePageContent, addPage]);
};