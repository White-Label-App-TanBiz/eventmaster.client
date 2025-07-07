import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Palette } from "lucide-react";

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
  className?: string;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ label, value, onChange, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showCustomPicker, setShowCustomPicker] = useState(false);
  const [customColor, setCustomColor] = useState(value);
  const popoverRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Predefined colors with their Tailwind CSS values
  const colorOptions = [
    { name: "Red", colors: ["#ef4444", "#dc2626", "#b91c1c", "#991b1b", "#7f1d1d"] },
    { name: "Orange", colors: ["#f97316", "#ea580c", "#c2410c", "#9a3412", "#7c2d12"] },
    { name: "Amber", colors: ["#f59e0b", "#d97706", "#b45309", "#92400e", "#78350f"] },
    { name: "Yellow", colors: ["#eab308", "#ca8a04", "#a16207", "#854d0e", "#713f12"] },
    { name: "Lime", colors: ["#84cc16", "#65a30d", "#4d7c0f", "#365314", "#1a2e05"] },
    { name: "Green", colors: ["#22c55e", "#16a34a", "#15803d", "#166534", "#14532d"] },
    { name: "Emerald", colors: ["#10b981", "#059669", "#047857", "#065f46", "#064e3b"] },
    { name: "Teal", colors: ["#14b8a6", "#0d9488", "#0f766e", "#115e59", "#134e4a"] },
    { name: "Cyan", colors: ["#06b6d4", "#0891b2", "#0e7490", "#155e75", "#164e63"] },
    { name: "Sky", colors: ["#0ea5e9", "#0284c7", "#0369a1", "#075985", "#0c4a6e"] },
    { name: "Blue", colors: ["#3b82f6", "#2563eb", "#1d4ed8", "#1e40af", "#1e3a8a"] },
    { name: "Indigo", colors: ["#6366f1", "#4f46e5", "#4338ca", "#3730a3", "#312e81"] },
    { name: "Violet", colors: ["#8b5cf6", "#7c3aed", "#6d28d9", "#5b21b6", "#4c1d95"] },
    { name: "Purple", colors: ["#a855f7", "#9333ea", "#7e22ce", "#6b21a8", "#581c87"] },
    { name: "Fuchsia", colors: ["#d946ef", "#c026d3", "#a21caf", "#86198f", "#701a75"] },
    { name: "Pink", colors: ["#ec4899", "#db2777", "#be185d", "#9d174d", "#831843"] },
    { name: "Rose", colors: ["#f43f5e", "#e11d48", "#be123c", "#9f1239", "#881337"] },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node) && triggerRef.current && !triggerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowCustomPicker(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleColorSelect = (color: string) => {
    onChange(color);
    setIsOpen(false);
    setShowCustomPicker(false);
  };

  const handleCustomColorChange = (color: string) => {
    setCustomColor(color);
  };

  const handleCustomColorApply = () => {
    onChange(customColor);
    setIsOpen(false);
    setShowCustomPicker(false);
  };

  const getColorName = (hexColor: string) => {
    for (const colorGroup of colorOptions) {
      if (colorGroup.colors.includes(hexColor.toLowerCase())) {
        return colorGroup.name;
      }
    }
    return "Custom";
  };

  return (
    <div className={`relative ${className}`}>
      <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">{label}</label>

      <button
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors focus:ring-2 focus:ring-blue-700 focus:border-transparent"
      >
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 rounded border border-gray-300 dark:border-zinc-600" style={{ backgroundColor: value }} />
          <span className="text-sm">{getColorName(value)}</span>
        </div>
        <ChevronDown className="w-4 h-4 text-gray-500 dark:text-zinc-400" />
      </button>

      {isOpen && (
        <div ref={popoverRef} className="absolute left-0 top-full mt-2 w-80 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg shadow-lg py-4 z-50 animate-fade-in">
          {!showCustomPicker ? (
            <>
              {/* Predefined Colors */}
              <div className="px-4 mb-4">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Choose a color</h4>
                <div className="grid grid-cols-2 gap-3">
                  {colorOptions.map((colorGroup) => (
                    <div key={colorGroup.name} className="space-y-2">
                      <div className="text-xs font-medium text-gray-600 dark:text-zinc-400">{colorGroup.name}</div>
                      <div className="flex space-x-1">
                        {colorGroup.colors.map((color, index) => (
                          <button
                            key={index}
                            onClick={() => handleColorSelect(color)}
                            className={`w-6 h-6 rounded border-2 transition-all hover:scale-110 ${
                              value.toLowerCase() === color.toLowerCase() ? "border-gray-900 dark:border-white ring-2 ring-blue-500" : "border-gray-300 dark:border-zinc-600 hover:border-gray-400 dark:hover:border-zinc-500"
                            }`}
                            style={{ backgroundColor: color }}
                            title={`${colorGroup.name} ${500 + index * 100}`}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Custom Color Button */}
              <div className="px-4 pt-3 border-t border-gray-200 dark:border-zinc-700">
                <button
                  onClick={() => setShowCustomPicker(true)}
                  className="w-full flex items-center justify-center space-x-2 px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  <Palette className="w-4 h-4" />
                  <span className="text-sm">Custom Color</span>
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Custom Color Picker */}
              <div className="px-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">Custom Color</h4>
                  <button onClick={() => setShowCustomPicker(false)} className="text-sm text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-300">
                    Back
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Color Preview */}
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-lg border border-gray-300 dark:border-zinc-600" style={{ backgroundColor: customColor }} />
                    <div className="flex-1">
                      <input type="color" value={customColor} onChange={(e) => handleCustomColorChange(e.target.value)} className="w-full h-10 border border-gray-300 dark:border-zinc-700 rounded cursor-pointer" />
                    </div>
                  </div>

                  {/* Hex Input */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-zinc-400 mb-1">Hex Color</label>
                    <input
                      type="text"
                      value={customColor}
                      onChange={(e) => handleCustomColorChange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                      placeholder="#000000"
                    />
                  </div>

                  {/* Apply Button */}
                  <div className="flex space-x-2">
                    <button onClick={() => setShowCustomPicker(false)} className="flex-1 px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                      Cancel
                    </button>
                    <button onClick={handleCustomColorApply} className="flex-1 px-3 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-sm transition-colors">
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ColorPicker;
