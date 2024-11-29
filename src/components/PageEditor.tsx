import React, { useRef, useCallback, useMemo } from 'react';
import { useResizeObserver } from '../hooks/useResizeObserver';
import { usePageContent } from '../hooks/usePageContent';
import EditableContent from './EditableContent';
import { PAGE_DIMENSIONS, calculateLineHeight, calculateMaxHeight } from '../utils/pageCalculations';

interface PageEditorProps {
  content: string;
  onChange: (content: string) => void;
  theme: 'dark' | 'light';
  fontSize: number;
  showLineNumbers: boolean;
}

const PageEditor: React.FC<PageEditorProps> = ({
  content,
  onChange,
  theme,
  fontSize,
  showLineNumbers
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const maxLines = useMemo(() => {
    const lineHeight = calculateLineHeight(fontSize);
    const maxHeight = calculateMaxHeight(fontSize);
    return Math.floor(maxHeight / lineHeight);
  }, [fontSize]);

  const lineHeight = useMemo(() => calculateLineHeight(fontSize), [fontSize]);

  const themeClasses = useMemo(() => ({
    dark: {
      page: 'bg-gray-800 shadow-xl',
      text: 'text-gray-100',
      lineNumbers: 'bg-gray-700 text-gray-400'
    },
    light: {
      page: 'bg-white shadow-xl',
      text: 'text-gray-900',
      lineNumbers: 'bg-gray-100 text-gray-500'
    }
  }), []);

  const {
    pages,
    activePageId,
    updatePageContent,
    addPage,
    removePage,
    setActivePage,
    cleanEmptyPages,
    mergeWithPreviousPage
  } = usePageContent(content);

  const handleContentChange = useCallback((pageId: string, newContent: string) => {
    const editor = editorRefs.current[pageId];
    if (!editor) return;

    updatePageContent(pageId, newContent, editor);
    
    const combinedContent = pages
      .map(page => page.content)
      .join('\n');
    onChange(combinedContent);
  }, [pages, updatePageContent, onChange]);

  const handleBackspace = useCallback((pageId: string) => {
    const editor = editorRefs.current[pageId];
    if (!editor || editor.textContent?.trim().length > 0) return;

    const pageIndex = pages.findIndex(p => p.id === pageId);
    if (pageIndex > 0) {
      removePage(pageId);
      
      const prevPage = pages[pageIndex - 1];
      const prevEditor = editorRefs.current[prevPage.id];
      
      if (prevEditor) {
        prevEditor.focus();
        const range = document.createRange();
        range.selectNodeContents(prevEditor);
        range.collapse(false);
        const selection = window.getSelection();
        if (selection) {
          selection.removeAllRanges();
          selection.addRange(range);
        }
      }
    }
  }, [pages, removePage]);

  const handleResize = useCallback(() => {
    pages.forEach(page => {
      const editor = editorRefs.current[page.id];
      if (editor) {
        handleContentChange(page.id, editor.innerHTML);
      }
    });
  }, [pages, handleContentChange]);

  useResizeObserver(containerRef, handleResize);

  // Focus the editor when a new page is created
  React.useEffect(() => {
    const activeEditor = editorRefs.current[activePageId];
    if (activeEditor) {
      activeEditor.focus();
      const range = document.createRange();
      range.selectNodeContents(activeEditor);
      range.collapse(false);
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
      }
      activeEditor.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [activePageId]);

  return (
    <div 
      ref={containerRef}
      className="flex flex-col items-center gap-8 py-8 overflow-auto max-h-[calc(100vh-12rem)]"
    >
      {pages.map((page, index) => (
        <div
          key={page.id}
          className={`relative ${themeClasses[theme].page} page`}
          style={{
            width: `${PAGE_DIMENSIONS.width}px`,
            height: `${PAGE_DIMENSIONS.height}px`,
            padding: `${PAGE_DIMENSIONS.margins.top}px ${PAGE_DIMENSIONS.margins.right}px ${PAGE_DIMENSIONS.margins.bottom}px ${PAGE_DIMENSIONS.margins.left}px`,
          }}
        >
          {showLineNumbers && (
            <div 
              className={`absolute left-0 top-0 bottom-0 w-12 ${themeClasses[theme].lineNumbers} pt-4 text-right pr-2 select-none font-mono`}
              style={{ fontSize: `${fontSize}px` }}
            >
              {Array.from({ length: maxLines }).map((_, i) => (
                <div key={i} style={{ lineHeight: '1.15' }}>{i + 1}</div>
              ))}
            </div>
          )}
          <EditableContent
            ref={el => editorRefs.current[page.id] = el}
            content={page.content}
            onChange={(newContent) => handleContentChange(page.id, newContent)}
            onBackspace={() => handleBackspace(page.id)}
            onFocus={() => setActivePage(page.id)}
            className={`outline-none min-h-full prose ${
              theme === 'light' ? 'prose-slate' : 'prose-invert'
            } max-w-none ${showLineNumbers ? 'ml-12' : ''}`}
            style={{
              fontSize: `${fontSize}px`,
              lineHeight: '1.15',
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              height: `${maxLines * lineHeight}px`,
              overflow: 'hidden'
            }}
          />
          <div className="absolute bottom-4 right-4 text-sm text-gray-500">
            Страница {index + 1}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PageEditor;