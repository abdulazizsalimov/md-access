import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';

interface EditableContentProps {
  content: string;
  onChange: (content: string) => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  className?: string;
  style?: React.CSSProperties;
}

const EditableContent = forwardRef<HTMLDivElement, EditableContentProps>(({
  content,
  onChange,
  onKeyDown,
  className,
  style
}, ref) => {
  const localRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => localRef.current!, []);

  useEffect(() => {
    if (localRef.current && localRef.current.innerHTML !== content) {
      const selection = window.getSelection();
      let savedRange: Range | null = null;

      // Save current selection if editor is focused
      if (document.activeElement === localRef.current && selection?.rangeCount) {
        savedRange = selection.getRangeAt(0).cloneRange();
      }

      // Update content
      localRef.current.innerHTML = content;

      // Restore selection if we had one
      if (savedRange && document.activeElement === localRef.current) {
        try {
          // Try to restore the exact range
          selection?.removeAllRanges();
          selection?.addRange(savedRange);
        } catch (e) {
          // If restoring exact position fails, move to end
          const range = document.createRange();
          range.selectNodeContents(localRef.current);
          range.collapse(false);
          selection?.removeAllRanges();
          selection?.addRange(range);
        }
      }
    }
  }, [content]);

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const newContent = e.currentTarget.innerHTML;
    onChange(newContent);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (onKeyDown) {
      onKeyDown(e);
    }

    // Handle tab key
    if (e.key === 'Tab') {
      e.preventDefault();
      document.execCommand('insertText', false, '\t');
    }
  };

  return (
    <div
      ref={localRef}
      contentEditable
      onInput={handleInput}
      onKeyDown={handleKeyDown}
      onPaste={handlePaste}
      className={className}
      style={{
        ...style,
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        outline: 'none',
        caretColor: 'auto'
      }}
      suppressContentEditableWarning
    />
  );
});

EditableContent.displayName = 'EditableContent';

export default EditableContent;