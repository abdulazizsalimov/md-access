import React from 'react';

interface ToolbarGroupProps {
  title: string;
  children: React.ReactNode;
}

const ToolbarGroup: React.FC<ToolbarGroupProps> = ({ title, children }) => (
  <div className="flex flex-col">
    <span className="text-xs text-gray-400 mb-1 px-2">{title}</span>
    <div className="flex items-center gap-1 bg-gray-750 rounded-lg p-1">
      {children}
    </div>
  </div>
);

export default ToolbarGroup;