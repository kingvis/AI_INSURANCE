"use client";

interface InlineCountryFlagProps {
  countryCode: string;
  size?: number;
  className?: string;
}

export function InlineCountryFlag({ 
  countryCode, 
  size = 48, 
  className = '' 
}: InlineCountryFlagProps) {
  
  // Base64-encoded SVG flags for reliable offline display
  const flagData: Record<string, string> = {
    'US': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iMzAiIHZpZXdCb3g9IjAgMCA0MCAzMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjMwIiBmaWxsPSIjQjIyMjM0Ii8+CjxyZWN0IHk9IjIiIHdpZHRoPSI0MCIgaGVpZ2h0PSIyIiBmaWxsPSJ3aGl0ZSIvPgo8cmVjdCB5PSI2IiB3aWR0aD0iNDAiIGhlaWdodD0iMiIgZmlsbD0id2hpdGUiLz4KPHJlY3QgeT0iMTAiIHdpZHRoPSI0MCIgaGVpZ2h0PSIyIiBmaWxsPSJ3aGl0ZSIvPgo8cmVjdCB5PSIxNCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjIiIGZpbGw9IndoaXRlIi8+CjxyZWN0IHk9IjE4IiB3aWR0aD0iNDAiIGhlaWdodD0iMiIgZmlsbD0id2hpdGUiLz4KPHJlY3QgeT0iMjIiIHdpZHRoPSI0MCIgaGVpZ2h0PSIyIiBmaWxsPSJ3aGl0ZSIvPgo8cmVjdCB5PSIyNiIgd2lkdGg9IjQwIiBoZWlnaHQ9IjIiIGZpbGw9IndoaXRlIi8+CjxyZWN0IHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZmlsbD0iIzM5MzFBNSIvPgo8L3N2Zz4K',
    
    'IN': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iMzAiIHZpZXdCb3g9IjAgMCA0MCAzMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjMwIiBmaWxsPSJ3aGl0ZSIvPgo8cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iMTAiIGZpbGw9IiNGRjk5MzMiLz4KPHJlY3QgeT0iMjAiIHdpZHRoPSI0MCIgaGVpZ2h0PSIxMCIgZmlsbD0iIzEzOEEwOCIvPgo8Y2lyY2xlIGN4PSIyMCIgY3k9IjE1IiByPSI0IiBzdHJva2U9IiMwMDAwODAiIHN0cm9rZS13aWR0aD0iMC41IiBmaWxsPSJub25lIi8+CjxjaXJjbGUgY3g9IjIwIiBjeT0iMTUiIHI9IjEuNSIgZmlsbD0iIzAwMDA4MCIvPgo8L3N2Zz4K',
    
    'UK': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iMzAiIHZpZXdCb3g9IjAgMCA0MCAzMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjMwIiBmaWxsPSIjMDEyMTY5Ii8+Cjxwb2x5Z29uIHBvaW50cz0iMCwwIDQwLDMwIDQwLDI0IDgsMCIgZmlsbD0id2hpdGUiLz4KPHBvbHlnb24gcG9pbnRzPSI0MCwwIDAsIDMwIDAsIDI0IDMyLDAiIGZpbGw9IndoaXRlIi8+CjxyZWN0IHk9IjEyIiB3aWR0aD0iNDAiIGhlaWdodD0iNiIgZmlsbD0id2hpdGUiLz4KPHJlY3QgeD0iMTciIHdpZHRoPSI2IiBoZWlnaHQ9IjMwIiBmaWxsPSJ3aGl0ZSIvPgo8cG9seWdvbiBwb2ludHM9IjAsIDAgMzAsIDMwIDMwLCAyNCA2LDAiIGZpbGw9IiNDODA4MTYiLz4KPHBvbHlnb24gcG9pbnRzPSI0MCwwIDEwLCAzMCAxMCwgMjQgMzQsIDAiIGZpbGw9IiNDODA4MTYiLz4KPHJlY3QgeT0iMTMuNSIgd2lkdGg9IjQwIiBoZWlnaHQ9IjMiIGZpbGw9IiNDODA4MTYiLz4KPHJlY3QgeD0iMTguNSIgd2lkdGg9IjMiIGhlaWdodD0iMzAiIGZpbGw9IiNDODA4MTYiLz4KPC9zdmc+Cg==',
    
    'CA': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iMzAiIHZpZXdCb3g9IjAgMCA0MCAzMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjMwIiBmaWxsPSJ3aGl0ZSIvPgo8cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMzAiIGZpbGw9IiNGRjAwMDAiLz4KPHJlY3QgeD0iMzAiIHdpZHRoPSIxMCIgaGVpZ2h0PSIzMCIgZmlsbD0iI0ZGMDAwMCIvPgo8cG9seWdvbiBwb2ludHM9IjIwLDggMjIsIDEyIDI2LCAxMCAyNCwgMTQgMjgsIDEzIDI0LCAxNiAyNiwgMjAgMjAsIDE3IDE0LCAyMCAxNiwgMTYgMTIsIDEzIDE2LCAxNCAyMCwgOCIgZmlsbD0iI0ZGMDAwMCIvPgo8L3N2Zz4K',
    
    'AU': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iMzAiIHZpZXdCb3g9IjAgMCA0MCAzMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjMwIiBmaWxsPSIjMDEyMTY5Ii8+CjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIxNSIgZmlsbD0iIzAxMjE2OSIvPgo8cG9seWdvbiBwb2ludHM9IjAsMCA0LDMgOCwwIDgsNiA0LDkgMCw2IiBmaWxsPSJ3aGl0ZSIvPgo8cG9seWdvbiBwb2ludHM9IjQsMyA4LDYgOCw5IDQsNiAwLDkgMCw2IiBmaWxsPSIjQzgwODE2Ii8+CjxyZWN0IHg9IjMiIHdpZHRoPSIyIiBoZWlnaHQ9IjE1IiBmaWxsPSJ3aGl0ZSIvPgo8cmVjdCB5PSI2LjUiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyIiBmaWxsPSJ3aGl0ZSIvPgo8cG9seWdvbiBwb2ludHM9IjIzLDUgMjQsNCAyNSw1IDI0LDYiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0yNyA4TDI5IDEwTDMxIDhMMzAgMTBMMzIgMTJMMzAgMTNMMzEgMTVMMjkgMTNMMjcgMTVMMjggMTNMMjYgMTJMMjggMTAiIGZpbGw9IndoaXRlIi8+CjxjaXJjbGUgY3g9IjM1IiBjeT0iMjMiIHI9IjEuNSIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cg==',
    
    'DE': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iMzAiIHZpZXdCb3g9IjAgMCA0MCAzMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjMwIiBmaWxsPSIjRkZDRTAwIi8+CjxyZWN0IHdpZHRoPSI0MCIgaGVpZ2h0PSIxMCIgZmlsbD0iIzAwMDAwMCIvPgo8cmVjdCB5PSIxMCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjREQwMDFCIi8+Cjwvc3ZnPgo='
  };

  const flagSrc = flagData[countryCode.toUpperCase()] || flagData['US'];
  
  return (
    <div 
      className={`inline-block rounded border shadow-sm overflow-hidden ${className}`}
      style={{ 
        width: `${size}px`, 
        height: `${size * 0.75}px`,
        backgroundColor: '#f3f4f6'
      }}
    >
      <img
        src={flagSrc}
        alt={`${countryCode} flag`}
        width={size}
        height={size * 0.75}
        className="w-full h-full object-cover"
        style={{ 
          width: `${size}px`,
          height: `${size * 0.75}px`,
          display: 'block'
        }}
        onLoad={() => console.log(`✅ SVG flag displayed successfully: ${countryCode}`)}
        onError={() => console.error(`❌ SVG flag failed to display: ${countryCode}`)}
      />
    </div>
  );
} 