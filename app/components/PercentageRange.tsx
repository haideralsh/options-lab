import * as Slider from "@radix-ui/react-slider";
import { useState } from "react";

export default function PercentageRange() {
  const [value, setValue] = useState<number[]>([12]);

  return (
    <div>
      <label htmlFor="percentage" className="text-xs text-gray-200 font-medium">
        Percentage
      </label>
      <div className="flex gap-3 items-start mt-1">
        <div className="relative w-full flex-grow">
          <Slider.Root
            name="percentage"
            className="relative flex items-center select-none touch-none h-5  overflow-hidden"
            value={value}
            onValueChange={(value: number[]) => setValue(value)}
            max={100}
            step={1}
            minStepsBetweenThumbs={1}
          >
            <Slider.Track className="relative grow h-[9px] slider">
              <Slider.Range className="absolute bg-gray-200 h-full" />
            </Slider.Track>
            <Slider.Thumb aria-label="Volume" />
          </Slider.Root>
          <button
            onClick={() => setValue([0])}
            className="pointer size-4 absolute top-full left-0 text-xs text-gray-500 tracking-tighter tabular-nums"
          >
            0
          </button>
          <button
            onClick={() => setValue([12])}
            className="pointer absolute top-full left-[12%] text-xs text-gray-500 tracking-tighter tabular-nums"
          >
            12
          </button>
          <button
            onClick={() => setValue([50])}
            className="pointer absolute top-full left-[47.5%] text-xs text-gray-500 tracking-tighter tabular-nums"
          >
            50
          </button>
          <button
            onClick={() => setValue([100])}
            className="pointer  absolute top-full left-[92%] text-xs text-gray-500 tracking-tighter tabular-nums"
          >
            100
          </button>
        </div>
        <label className="flex items-center relative">
          <input
            className="rounded-md pr-[3.25rem] bg-gray-800 border border-gray-600 py-2 px-3 text-left focus:outline-none focus-visible:border-gray-400 focus-visible:ring-0 focus-visible:ring-gray-400 focus-visible:ring-offset-0 focus-visible:ring-offset-gray-400 sm:text-sm"
            maxLength={3}
            max={100}
            min={0}
            step={1}
            value={value[0]}
            type="number"
            onChange={(e) => {
              const percentage = e.target.valueAsNumber;

              if (isNaN(percentage)) {
                setValue([0]);
              } else if (percentage >= 0 && percentage <= 100) {
                setValue([percentage]);
              }
            }}
          />
          <span className="text-sm absolute text-gray-400 right-0 w-7">%</span>
        </label>
      </div>
    </div>
  );
}
