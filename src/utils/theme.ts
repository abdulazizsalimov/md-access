export const themeClasses = {
  dark: {
    container: 'bg-gray-900 text-gray-100',
    menuBar: 'bg-gray-800 border-b border-gray-700',
    toolbar: 'bg-gray-800 border-b border-gray-700',
    editor: 'bg-gray-800',
    lineNumbers: 'bg-gray-700 text-gray-400',
    stats: 'bg-gray-800 border-t border-gray-700',
    button: 'text-gray-100 hover:bg-gray-700'
  },
  light: {
    container: 'bg-gray-100 text-gray-900',
    menuBar: 'bg-gray-200 border-b border-gray-300 shadow-sm',
    toolbar: 'bg-gray-200 border-b border-gray-300 shadow-sm',
    editor: 'bg-white shadow-sm',
    lineNumbers: 'bg-gray-100 text-gray-500',
    stats: 'bg-gray-200 border-t border-gray-300 shadow-sm',
    button: 'text-gray-900 hover:bg-gray-300'
  }
} as const;