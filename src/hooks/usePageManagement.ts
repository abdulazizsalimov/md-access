import { useState, useEffect, RefObject, useCallback } from 'react';
import { calculateMaxHeight, findSplitIndex } from '../utils/pageCalculations';

interface Page {
  id: string;
  content: string;
}

export const usePageManagement = (
  fontSize: number,
  editorRefs: RefObject<{ [key: string]: HTMLDivElement | null }>,
  initialContent: string
) => {
  const [pages, setPages] = useState<Page[]>([{ id: '1', content: initialContent }]);
  const [activePageId, setActivePageId] = useState('1');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePageOverflow = useCallback((pageId: string, content: string) => {
    if (isProcessing) return false;

    const editor = editorRefs.current?.[pageId];
    if (!editor) return false;

    const maxHeight = calculateMaxHeight(fontSize);
    
    if (editor.scrollHeight > maxHeight) {
      setIsProcessing(true);

      const tempDiv = document.createElement('div');
      tempDiv.style.cssText = editor.style.cssText;
      tempDiv.style.height = 'auto';
      tempDiv.style.position = 'absolute';
      tempDiv.style.visibility = 'hidden';
      document.body.appendChild(tempDiv);

      let low = 0;
      let high = content.length;
      let lastGoodIndex = 0;

      while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        tempDiv.innerHTML = content.substring(0, mid);

        if (tempDiv.scrollHeight <= maxHeight) {
          lastGoodIndex = mid;
          low = mid + 1;
        } else {
          high = mid - 1;
        }
      }

      const splitIndex = findSplitIndex(content, lastGoodIndex);
      const firstPageContent = content.substring(0, splitIndex);
      const remainingContent = content.substring(splitIndex).trim();

      document.body.removeChild(tempDiv);

      setPages(prev => {
        const pageIndex = prev.findIndex(p => p.id === pageId);
        if (pageIndex === -1) return prev;

        const newPages = [...prev];
        newPages[pageIndex] = { ...newPages[pageIndex], content: firstPageContent };

        if (remainingContent) {
          const nextPageId = (parseInt(pageId) + 1).toString();
          const existingNextPage = newPages[pageIndex + 1];

          if (existingNextPage) {
            newPages[pageIndex + 1] = { ...existingNextPage, content: remainingContent };
          } else {
            newPages.splice(pageIndex + 1, 0, { id: nextPageId, content: remainingContent });
          }

          requestAnimationFrame(() => {
            const nextEditor = editorRefs.current?.[nextPageId];
            if (nextEditor) {
              nextEditor.focus();
              const range = document.createRange();
              const sel = window.getSelection();
              range.selectNodeContents(nextEditor);
              range.collapse(false);
              sel?.removeAllRanges();
              sel?.addRange(range);
              nextEditor.scrollIntoView({ behavior: 'smooth' });
              setIsProcessing(false);
            }
          });
        } else {
          setIsProcessing(false);
        }

        return newPages;
      });

      return true;
    }

    return false;
  }, [fontSize, editorRefs, isProcessing]);

  const handlePageContent = useCallback((pageId: string, newContent: string) => {
    if (isProcessing) return;
    
    setPages(prev => {
      const updatedPages = prev.map(page =>
        page.id === pageId ? { ...page, content: newContent } : page
      );
      return updatedPages;
    });
  }, [isProcessing]);

  const handlePageFocus = useCallback((pageId: string) => {
    setActivePageId(pageId);
  }, []);

  // Clean up empty pages
  useEffect(() => {
    if (isProcessing) return;

    const timer = setTimeout(() => {
      setPages(prev => {
        if (prev.length <= 1) return prev;
        const filtered = prev.filter((page, index) => 
          index === 0 || page.content.trim().length > 0
        );
        return filtered.length !== prev.length ? filtered : prev;
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [pages, isProcessing]);

  return {
    pages,
    activePageId,
    handlePageContent,
    handlePageFocus,
    handlePageOverflow,
    isProcessing
  };
};