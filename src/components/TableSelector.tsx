import React, { useState } from 'react';

interface TableSelectorProps {
  onSelect: (rows: number, cols: number) => void;
  onClose: () => void;
  theme: 'dark' | 'light';
}

const TableSelector: React.FC<TableSelectorProps> = ({ onSelect, onClose, theme }) => {
  const [hoveredCells, setHoveredCells] = useState({ rows: 0, cols: 0 });
  const maxRows = 8;
  const maxCols = 8;

  const themeClasses = {
    dark: {
      container: 'bg-gray-800 border border-gray-700',
      cell: 'border-gray-700',
      hover: 'bg-blue-600',
      text: 'text-gray-300'
    },
    light: {
      container: 'bg-white border border-gray-300',
      cell: 'border-gray-300',
      hover: 'bg-blue-500',
      text: 'text-gray-600'
    }
  };

  return (
    <div 
      className={`absolute z-50 p-2 rounded-lg shadow-xl ${themeClasses[theme].container}`}
      style={{ top: '100%', left: '0' }}
      onMouseLeave={() => setHoveredCells({ rows: 0, cols: 0 })}
    >
      <div className="grid gap-0.5" style={{ gridTemplateColumns: `repeat(${maxCols}, 1.5rem)` }}>
        {Array.from({ length: maxRows }).map((_, rowIndex) => (
          <React.Fragment key={rowIndex}>
            {Array.from({ length: maxCols }).map((_, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`w-6 h-6 border ${themeClasses[theme].cell} transition-colors duration-75
                  ${rowIndex <= hoveredCells.rows && colIndex <= hoveredCells.cols 
                    ? themeClasses[theme].hover 
                    : ''
                  }`}
                onMouseEnter={() => setHoveredCells({ rows: rowIndex, cols: colIndex })}
                onClick={() => onSelect(rowIndex + 1, colIndex + 1)}
              />
            ))}
          </React.Fragment>
        ))}
      </div>
      <div className={`mt-2 text-center text-sm ${themeClasses[theme].text}`}>
        {hoveredCells.rows > 0 && hoveredCells.cols > 0
          ? `${hoveredCells.rows + 1}×${hoveredCells.cols + 1} таблица`
          : 'Наведите для выбора размера'
        }
      </div>
    </div>
  );
};

export default TableSelector;