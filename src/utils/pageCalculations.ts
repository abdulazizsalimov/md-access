// Convert millimeters to pixels (assuming 96 DPI)
const MM_TO_PX = 96 / 25.4;

// A4 dimensions in millimeters
const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;

// Margins in millimeters (standard word processor margins)
const MARGINS = {
  top: 25.4,    // 1 inch
  bottom: 25.4, // 1 inch
  left: 25.4,   // 1 inch
  right: 25.4   // 1 inch
};

// Buffer zone for page breaks (in pixels)
const PAGE_BREAK_BUFFER = 48; // Approximately 4 lines of text

// Convert A4 dimensions to pixels
export const PAGE_DIMENSIONS = {
  width: Math.floor(A4_WIDTH_MM * MM_TO_PX),
  height: Math.floor(A4_HEIGHT_MM * MM_TO_PX),
  margins: {
    top: Math.floor(MARGINS.top * MM_TO_PX),
    bottom: Math.floor(MARGINS.bottom * MM_TO_PX),
    left: Math.floor(MARGINS.left * MM_TO_PX),
    right: Math.floor(MARGINS.right * MM_TO_PX)
  }
};

export const calculateLineHeight = (fontSize: number) => {
  return Math.ceil(fontSize * 1.15);
};

export const calculateMaxHeight = (fontSize: number) => {
  // Subtract buffer zone from available height for smoother page breaks
  return PAGE_DIMENSIONS.height - (PAGE_DIMENSIONS.margins.top + PAGE_DIMENSIONS.margins.bottom + PAGE_BREAK_BUFFER);
};

export const calculateMaxLines = (fontSize: number) => {
  const lineHeight = calculateLineHeight(fontSize);
  const contentHeight = calculateMaxHeight(fontSize);
  return Math.floor(contentHeight / lineHeight);
};