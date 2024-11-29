import { useState, useCallback, useRef } from 'react';
import { calculateMaxHeight } from '../utils/pageCalculations';
import { shouldCreateNewPage, getLastVisiblePosition } from '../utils/pageUtils';

interface Page {
  id: string;
  content: string;
}

export const usePageContent = (initialContent: string) => {
  const [pages, setPages] = useState<Page[]>([{ id: '1', content: initialContent }]);
  const [activePageId, setActivePageId] = useState('1');
  const isProcessingRef = useRef(false);

  const updatePageContent = useCallback((pageId: string, content: string, element: HTMLElement) => {
    if (isProcessingRef.current) return;
    
    try {
      isProcessingRef.current = true;
      const maxHeight = calculateMaxHeight(parseInt(element.style.fontSize));

      setPages(prev => {
        const pageIndex = prev.findIndex(p => p.id === pageId);
        if (pageIndex === -1) return prev;

        // Check if content exceeds page height
        if (shouldCreateNewPage(element, maxHeight)) {
          const position = getLastVisiblePosition(element, content, maxHeight);
          const firstPart = content.substring(0, position);
          const remainingContent = content.substring(position).trim();

          const newPages = [...prev];
          newPages[pageIndex] = { ...newPages[pageIndex], content: firstPart };

          // Only create new page if there's remaining content
          if (remainingContent) {
            const nextPageId = Date.now().toString();
            newPages.splice(pageIndex + 1, 0, { 
              id: nextPageId, 
              content: remainingContent 
            });
            setActivePageId(nextPageId);
          }

          return newPages;
        }

        // Update content normally if no overflow
        return prev.map(page =>
          page.id === pageId ? { ...page, content } : page
        );
      });
    } finally {
      setTimeout(() => {
        isProcessingRef.current = false;
      }, 50);
    }
  }, []);

  const addPage = useCallback((afterPageId: string, content: string = '') => {
    const newPageId = Date.now().toString();
    setPages(prev => {
      const pageIndex = prev.findIndex(p => p.id === afterPageId);
      if (pageIndex === -1) return prev;
      
      const newPages = [...prev];
      newPages.splice(pageIndex + 1, 0, { id: newPageId, content });
      return newPages;
    });
    setActivePageId(newPageId);
    return newPageId;
  }, []);

  const removePage = useCallback((pageId: string) => {
    setPages(prev => {
      if (prev.length <= 1) return prev;
      
      const pageIndex = prev.findIndex(p => p.id === pageId);
      if (pageIndex === -1) return prev;

      const newPages = prev.filter(page => page.id !== pageId);
      
      if (pageIndex > 0) {
        setActivePageId(prev[pageIndex - 1].id);
      } else {
        setActivePageId(newPages[0].id);
      }

      return newPages;
    });
  }, []);

  const setActivePage = useCallback((pageId: string) => {
    setActivePageId(pageId);
  }, []);

  const cleanEmptyPages = useCallback(() => {
    if (isProcessingRef.current) return;

    setPages(prev => {
      if (prev.length <= 1) return prev;
      return prev.filter((page, index) => {
        if (index === prev.length - 1) return true;
        return page.content.trim().length > 0;
      });
    });
  }, []);

  return {
    pages,
    activePageId,
    updatePageContent,
    addPage,
    removePage,
    setActivePage,
    cleanEmptyPages
  };
};