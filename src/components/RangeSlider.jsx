import React, { useEffect, useRef, useState } from "react";

const RangeSlider = ({ min, max, step = 1, onChange }) => {
  const [minPrice, setMinPrice] = useState(min);
  const [maxPrice, setMaxPrice] = useState(max);
  const containerRef = useRef(null);

  // Sync with parent min/max changes
  useEffect(() => {
    setMinPrice(min);
    setMaxPrice(max);
  }, [min, max]);

  const handleMinChange = (e) => {
    const value = Math.min(Number(e.target.value), maxPrice - step);
    setMinPrice(value);
    onChange(value, maxPrice);
  };

  const handleMaxChange = (e) => {
    const value = Math.max(Number(e.target.value), minPrice + step);
    setMaxPrice(value);
    onChange(minPrice, value);
  };

  // Calculate progress bar position
  const progressStyle = {
    left: `${((minPrice - min) / (max - min)) * 100}%`,
    width: `${((maxPrice - minPrice) / (max - min)) * 100}%`,
  };

  return (
    <div className="w-full p-4 bg-white rounded-lg">
      {/* Value Labels - fixed positioning issues */}
      <div className="flex justify-between w-full mb-6">
        <div className="bg-black text-white py-1 px-3 rounded-md text-sm">
          ₦{minPrice}
        </div>
        <div className="bg-black text-white py-1 px-3 rounded-md text-sm">
          ₦{maxPrice}
        </div>
      </div>

      {/* Slider Track Container */}
      <div className="relative w-full h-8" ref={containerRef}>
        {/* Background Track */}
        <div className="absolute top-1/2 left-0 right-0 h-1.5 bg-gray-300 rounded-full -translate-y-1/2" />
        
        {/* Active Progress Bar */}
        <div
          className="absolute top-1/2 h-1.5 bg-primary rounded-full -translate-y-1/2 z-10"
          style={progressStyle}
        />
        
        {/* Min Thumb */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={minPrice}
          onChange={handleMinChange}
          className="absolute w-full h-full appearance-none bg-transparent pointer-events-none z-20
            [&::-webkit-slider-thumb]:appearance-none 
            [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 
            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white 
            [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary 
            [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto
            [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:active:scale-125
            
            [&::-moz-range-thumb]:appearance-none 
            [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 
            [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white 
            [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-primary 
            [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto
            [&::-moz-range-thumb]:shadow-lg [&::-moz-range-thumb]:active:scale-125"
        />
        
        {/* Max Thumb */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={maxPrice}
          onChange={handleMaxChange}
          className="absolute w-full h-full appearance-none bg-transparent pointer-events-none z-30
            [&::-webkit-slider-thumb]:appearance-none 
            [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 
            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white 
            [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary 
            [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto
            [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:active:scale-125
            
            [&::-moz-range-thumb]:appearance-none 
            [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 
            [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white 
            [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-primary 
            [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto
            [&::-moz-range-thumb]:shadow-lg [&::-moz-range-thumb]:active:scale-125"
        />
      </div>
    </div>
  );
};

export default RangeSlider;