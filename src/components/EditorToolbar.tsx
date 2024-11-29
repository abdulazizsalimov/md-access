import React, { useState } from 'react';
import { 
  Bold, Italic, Underline, Strikethrough, Heading1, Heading2,
  List, ListOrdered, Link2, Image, Quote, Code, Table,
  Type, PaintBucket, ZoomIn, ZoomOut,
  AlignLeft, AlignCenter, AlignRight
} from 'lucide-react';
import ToolbarButton from './ToolbarButton';
import ToolbarGroup from './ToolbarGroup';
import ColorPicker from './ColorPicker';
import TableSelector from './TableSelector';
import { themeClasses } from '../utils/theme';

interface EditorToolbarProps {
  theme: 'dark' | 'light';
  fontSize: number;
  setFontSize: (value: number | ((prev: number) => number)) => void;
  showColorPicker: boolean;
  setShowColorPicker: (show: boolean) => void;
  showBgColorPicker: boolean;
  setShowBgColorPicker: (show: boolean) => void;
  onFormat: (command: string, value?: string) => void;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({
  theme,
  fontSize,
  setFontSize,
  showColorPicker,
  setShowColorPicker,
  showBgColorPicker,
  setShowBgColorPicker,
  onFormat
}) => {
  const [showTableSelector, setShowTableSelector] = useState(false);

  const handleTableSelect = (rows: number, cols: number) => {
    const table = document.createElement('table');
    table.className = 'border-collapse w-full mb-4';
    
    for (let i = 0; i < rows; i++) {
      const row = table.insertRow();
      for (let j = 0; j < cols; j++) {
        const cell = row.insertCell();
        cell.className = 'border p-2';
        cell.innerHTML = '&nbsp;';
      }
    }

    onFormat('insertHTML', table.outerHTML);
    setShowTableSelector(false);
  };

  return (
    <div className={`p-2 border-b ${themeClasses[theme].toolbar}`}>
      <div className="flex items-center gap-4">
        <ToolbarGroup title="Форматирование текста">
          <ToolbarButton
            icon={<Bold className="w-4 h-4" />}
            onClick={() => onFormat('bold')}
            label="Полужирный"
            shortcut="Ctrl+B"
            theme={theme}
          />
          <ToolbarButton
            icon={<Italic className="w-4 h-4" />}
            onClick={() => onFormat('italic')}
            label="Курсив"
            shortcut="Ctrl+I"
            theme={theme}
          />
          <ToolbarButton
            icon={<Underline className="w-4 h-4" />}
            onClick={() => onFormat('underline')}
            label="Подчёркнутый"
            shortcut="Ctrl+U"
            theme={theme}
          />
          <ToolbarButton
            icon={<Strikethrough className="w-4 h-4" />}
            onClick={() => onFormat('strikeThrough')}
            label="Зачёркнутый"
            theme={theme}
          />
        </ToolbarGroup>

        <ToolbarGroup title="Заголовки">
          <ToolbarButton
            icon={<Heading1 className="w-4 h-4" />}
            onClick={() => onFormat('formatBlock', 'h1')}
            label="Заголовок 1"
            theme={theme}
          />
          <ToolbarButton
            icon={<Heading2 className="w-4 h-4" />}
            onClick={() => onFormat('formatBlock', 'h2')}
            label="Заголовок 2"
            theme={theme}
          />
        </ToolbarGroup>

        <ToolbarGroup title="Выравнивание">
          <ToolbarButton
            icon={<AlignLeft className="w-4 h-4" />}
            onClick={() => onFormat('justifyLeft')}
            label="По левому краю"
            theme={theme}
          />
          <ToolbarButton
            icon={<AlignCenter className="w-4 h-4" />}
            onClick={() => onFormat('justifyCenter')}
            label="По центру"
            theme={theme}
          />
          <ToolbarButton
            icon={<AlignRight className="w-4 h-4" />}
            onClick={() => onFormat('justifyRight')}
            label="По правому краю"
            theme={theme}
          />
        </ToolbarGroup>

        <ToolbarGroup title="Списки">
          <ToolbarButton
            icon={<List className="w-4 h-4" />}
            onClick={() => onFormat('insertUnorderedList')}
            label="Маркированный список"
            theme={theme}
          />
          <ToolbarButton
            icon={<ListOrdered className="w-4 h-4" />}
            onClick={() => onFormat('insertOrderedList')}
            label="Нумерованный список"
            theme={theme}
          />
        </ToolbarGroup>

        <ToolbarGroup title="Вставка">
          <ToolbarButton
            icon={<Link2 className="w-4 h-4" />}
            onClick={() => {
              const url = prompt('Введите URL:');
              if (url) onFormat('createLink', url);
            }}
            label="Ссылка"
            theme={theme}
          />
          <ToolbarButton
            icon={<Image className="w-4 h-4" />}
            onClick={() => {
              const url = prompt('Введите URL изображения:');
              if (url) onFormat('insertImage', url);
            }}
            label="Изображение"
            theme={theme}
          />
          <div className="relative">
            <ToolbarButton
              icon={<Table className="w-4 h-4" />}
              onClick={() => setShowTableSelector(!showTableSelector)}
              label="Таблица"
              theme={theme}
            />
            {showTableSelector && (
              <TableSelector
                onSelect={handleTableSelect}
                onClose={() => setShowTableSelector(false)}
                theme={theme}
              />
            )}
          </div>
          <ToolbarButton
            icon={<Quote className="w-4 h-4" />}
            onClick={() => onFormat('formatBlock', 'blockquote')}
            label="Цитата"
            theme={theme}
          />
          <ToolbarButton
            icon={<Code className="w-4 h-4" />}
            onClick={() => onFormat('formatBlock', 'pre')}
            label="Код"
            theme={theme}
          />
        </ToolbarGroup>

        <ToolbarGroup title="Цвет">
          <div className="relative">
            <ToolbarButton
              icon={<Type className="w-4 h-4" />}
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
              icon={<PaintBucket className="w-4 h-4" />}
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
        </ToolbarGroup>

        <ToolbarGroup title="Размер шрифта">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFontSize(prev => Math.max(8, prev - 2))}
              className="p-1 rounded hover:bg-gray-700"
              title="Уменьшить шрифт"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="w-12 text-center">{fontSize}px</span>
            <button
              onClick={() => setFontSize(prev => Math.min(72, prev + 2))}
              className="p-1 rounded hover:bg-gray-700"
              title="Увеличить шрифт"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>
        </ToolbarGroup>
      </div>
    </div>
  );
};

export default EditorToolbar;