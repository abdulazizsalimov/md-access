import React from 'react';

interface ColorPickerProps {
  onColorSelect: (color: string) => void;
  onClose: () => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ onColorSelect, onClose }) => {
  const themeColors = [
    ['#000000', '#262626', '#404040', '#595959', '#808080', '#A6A6A6', '#D9D9D9', '#FFFFFF'],
    ['#1A237E', '#283593', '#3949AB', '#3F51B5', '#5C6BC0', '#7986CB', '#9FA8DA', '#C5CAE9'],
    ['#1B5E20', '#2E7D32', '#388E3C', '#43A047', '#4CAF50', '#66BB6A', '#81C784', '#A5D6A7'],
    ['#B71C1C', '#C62828', '#D32F2F', '#E53935', '#F44336', '#EF5350', '#E57373', '#EF9A9A'],
    ['#E65100', '#EF6C00', '#F57C00', '#FB8C00', '#FF9800', '#FFA726', '#FFB74D', '#FFCC80'],
    ['#F57F17', '#F9A825', '#FBC02D', '#FDD835', '#FFEB3B', '#FFEE58', '#FFF176', '#FFF59D'],
    ['#4A148C', '#6A1B9A', '#7B1FA2', '#8E24AA', '#9C27B0', '#AB47BC', '#BA68C8', '#CE93D8'],
    ['#004D40', '#00695C', '#00796B', '#00897B', '#009688', '#26A69A', '#4DB6AC', '#80CBC4'],
  ];

  const standardColors = [
    '#FF0000', '#FF9900', '#FFFF00', '#00FF00', 
    '#00FFFF', '#0000FF', '#9900FF', '#FF00FF',
    '#F2F2F2', '#808080', '#000000', '#FF9999',
    '#FFCC99', '#FFFF99', '#99FF99', '#99FFFF'
  ];

  return (
    <div 
      className="absolute top-full left-0 mt-2 bg-gray-800 p-4 rounded-lg shadow-xl z-50"
      style={{ width: '240px' }}
    >
      <div className="mb-4">
        <div className="text-xs text-gray-400 mb-2">Цвета темы</div>
        <div className="grid gap-1">
          {themeColors.map((row, rowIndex) => (
            <div key={rowIndex} className="flex gap-1">
              {row.map((color) => (
                <button
                  key={color}
                  className="w-6 h-6 border border-gray-600 hover:border-blue-500 transition-colors"
                  style={{ backgroundColor: color }}
                  onClick={() => {
                    onColorSelect(color);
                    onClose();
                  }}
                  title={color}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="text-xs text-gray-400 mb-2">Стандартные цвета</div>
        <div className="grid grid-cols-8 gap-1">
          {standardColors.map((color) => (
            <button
              key={color}
              className="w-6 h-6 border border-gray-600 hover:border-blue-500 transition-colors"
              style={{ backgroundColor: color }}
              onClick={() => {
                onColorSelect(color);
                onClose();
              }}
              title={color}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ColorPicker;