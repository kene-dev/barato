import { useEffect, useState } from "react";

// eslint-disable-next-line react/prop-types
const RangeSlider = ({ min, max, step = 1, value, onChange }) => {
  const controlledMin = value?.[0];
  const controlledMax = value?.[1];
  const [minPrice, setMinPrice] = useState(controlledMin ?? min);
  const [maxPrice, setMaxPrice] = useState(controlledMax ?? max);

  // Keep the thumbs in sync when the parent clears a filter.
  useEffect(() => {
    setMinPrice(controlledMin ?? min);
    setMaxPrice(controlledMax ?? max);
  }, [min, max, controlledMin, controlledMax]);

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
    <div className="w-full">
      <div className="mb-4 grid grid-cols-2 gap-2">
        <div className="min-w-0 border border-[#e5d9cc] bg-white px-2 py-2">
          <span className="block text-[9px] uppercase tracking-[.12em] text-[#8d7c6e]">From</span>
          <span className="block text-[11px] font-semibold tabular-nums text-[#30251f]">₦{minPrice.toLocaleString('en-NG')}</span>
        </div>
        <div className="min-w-0 border border-[#e5d9cc] bg-white px-2 py-2">
          <span className="block text-[9px] uppercase tracking-[.12em] text-[#8d7c6e]">To</span>
          <span className="block text-[11px] font-semibold tabular-nums text-[#30251f]">₦{maxPrice.toLocaleString('en-NG')}</span>
        </div>
      </div>

      <div className="relative h-8 w-full">
        <div className="absolute top-1/2 right-0 left-0 h-1 -translate-y-1/2 bg-[#ded4c9]" />
        
        {/* Active Progress Bar */}
        <div
          className="absolute top-1/2 z-10 h-1 -translate-y-1/2 bg-[#a33075]"
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
          aria-label="Minimum price"
          className="absolute w-full h-full appearance-none bg-transparent pointer-events-none z-20
            [&::-webkit-slider-thumb]:appearance-none 
            [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 
            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white 
            [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#a33075]
            [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto
            [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:active:scale-125
            
            [&::-moz-range-thumb]:appearance-none 
            [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 
            [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white 
            [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[#a33075]
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
          aria-label="Maximum price"
          className="absolute w-full h-full appearance-none bg-transparent pointer-events-none z-30
            [&::-webkit-slider-thumb]:appearance-none 
            [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 
            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white 
            [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#a33075]
            [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto
            [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:active:scale-125
            
            [&::-moz-range-thumb]:appearance-none 
            [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 
            [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white 
            [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[#a33075]
            [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto
            [&::-moz-range-thumb]:shadow-lg [&::-moz-range-thumb]:active:scale-125"
        />
      </div>
    </div>
  );
};

export default RangeSlider;
