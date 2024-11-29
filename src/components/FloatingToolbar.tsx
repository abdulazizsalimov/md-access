import React, { useEffect, useState, useRef } from 'react';
import { 
  Bold, Italic, Underline, Strikethrough,
  AlignLeft, AlignCenter, AlignRight,
  Heading1, Heading2, Type, PaintBucket
} from 'lucide-react';
import ToolbarButton from './ToolbarButton';
import ColorPicker from './ColorPicker';

interface FloatingToolbarProps {
  selection: Selection;
  onFormat: (command: string, value?: string) => void;
  theme: 'dark' | 'light';
}

const FloatingToolbar: React.FC<FloatingToolbarProps> = ({ selection, onFormat, theme }) => {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showBgColorPicker, setShowBgColorPicker] = useState(false);
  const toolbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!selection || selection.isCollapsed || !selection.toString().trim()) {
      return;
    }

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    
    if (toolbarRef.current) {
      const toolbarHeight = toolbarRef.current.offsetHeight;
      const scrollY = window.scrollY;
      
      setPosition({
        top: rect.top + scrollY - toolbarHeight - 8,
        left: rect.left + (rect.width / 2)
      });
    }
  }, [selection]);

  const toolbarThemeClasses = {
    dark: 'bg-gray-800 shadow-lg border border-gray-700',
    light: 'bg-white shadow-lg border border-gray-200'
  };

  return (
    <div
      ref={toolbarRef}
      className={`fixed rounded-lg p-1.5 z-50 select-none ${toolbarThemeClasses[theme]}`}
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        transform: 'translateX(-50%)',
        display: 'grid',
        gridTemplateColumns: 'repeat(4, auto)',
        gap: '0.25rem',
      }}
      onMouseDown={(e) => e.preventDefault()}
    >
      <div className="flex items-center gap-0.5">
        <ToolbarButton
          icon={<Bold className="w-3.5 h-3.5" />}
          onClick={() => onFormat('bold')}
          label="Полужирный"
          theme={theme}
        />
        <ToolbarButton
          icon={<Italic className="w-3.5 h-3.5" />}
          onClick={() => onFormat('italic')}
          label="Курсив"
          theme={theme}
        />
        <ToolbarButton
          icon={<Underline className="w-3.5 h-3.5" />}
          onClick={() => onFormat('underline')}
          label="Подчёркнутый"
          theme={theme}
        />
        <ToolbarButton
          icon={<Strikethrough className="w-3.5 h-3.5" />}
          onClick={() => onFormat('strikeThrough')}
          label="Зачёркнутый"
          theme={theme}
        />
      </div>

      <div className="flex items-center gap-0.5">
        <ToolbarButton
          icon={<Heading1 className="w-3.5 h-3.5" />}
          onClick={() => onFormat('formatBlock', 'h1')}
          label="Заголовок 1"
          theme={theme}
        />
        <ToolbarButton
          icon={<Heading2 className="w-3.5 h-3.5" />}
          onClick={() => onFormat('formatBlock', 'h2')}
          label="Заголовок 2"
          theme={theme}
        />
      </div>

      <div className="flex items-center gap-0.5">
        <ToolbarButton
          icon={<AlignLeft className="w-3.5 h-3.5" />}
          onClick={() => onFormat('justifyLeft')}
          label="По левому краю"
          theme={theme}
        />
        <ToolbarButton
          icon={<AlignCenter className="w-3.5 h-3.5" />}
          onClick={() => onFormat('justifyCenter')}
          label="По центру"
          theme={theme}
        />
        <ToolbarButton
          icon={<AlignRight className="w-3.5 h-3.5" />}
          onClick={() => onFormat('justifyRight')}
          label="По правому краю"
          theme={theme}
        />
      </div>

      <div className="flex items-center gap-0.5">
        <div className="relative">
          <ToolbarButton
            icon={<Type className="w-3.5 h-3.5" />}
            onClick={() => setShowColorPicker(!showColorPicker)}
            label="Цвет текста"
            theme={theme}
          />
          {showColorPicker && (
            <ColorPicker
              onColorSelect={(color) => {
                onFormat('foreColor', color);
                setShowColorPicker(false);
              }}
              onClose={() => setShowColorPicker(false)}
              theme={theme}
            />
          )}
        </div>
        <div className="relative">
          <ToolbarButton
            icon={<PaintBucket className="w-3.5 h-3.5" />}
            onClick={() => setShowBgColorPicker(!showBgColorPicker)}
            label="Цвет фона"
            theme={theme}
          />
          {showBgColorPicker && (
            <ColorPicker
              onColorSelect={(color) => {
                onFormat('backColor', color);
                setShowBgColorPicker(false);
              }}
              onClose={() => setShowBgColorPicker(false)}
              theme={theme}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default FloatingToolbar;