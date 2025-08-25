import React from "react";

const ColorPalette = ({ colors, title, onColorClick }) => {
  return (
    <div className="space-y-3">
      {title && (
        <h4 className="text-sm font-medium text-gray-700">{title}</h4>
      )}
      <div className="flex space-x-2">
        {colors.map((color, index) => (
          <div
            key={index}
            className="relative group cursor-pointer"
            onClick={() => onColorClick && onColorClick(color)}
          >
            <div
              className="w-12 h-12 rounded-full shadow-md hover:shadow-lg transition-shadow duration-200"
              style={{ backgroundColor: color }}
            />
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              {color}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ColorPalette;