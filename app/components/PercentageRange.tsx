import * as Slider from "@radix-ui/react-slider";
import { useState } from "react";

export default function PercentageRange() {
  const [value, setValue] = useState<number[]>([20]);

  return (
    <div>
      <label htmlFor="percentage" className="text-xs text-gray-200 font-medium">
        Percentage
      </label>
      <div className="flex gap-3 items-center mt-1">
        <Slider.Root
          name="percentage"
          className="relative flex items-center select-none touch-none w-full flex-grow h-5"
          value={value}
          onValueChange={(value: number[]) => setValue(value)}
          max={100}
          step={1}
          minStepsBetweenThumbs={1}
        >
          <Slider.Track className="bg-gray-700 relative grow rounded-full h-[3px]">
            <Slider.Range className="absolute bg-gray-200 rounded-full h-full" />
          </Slider.Track>
          <Slider.Thumb className="block w-4 h-4 bg-gray-200 rounded-full" aria-label="Volume" />
        </Slider.Root>
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
