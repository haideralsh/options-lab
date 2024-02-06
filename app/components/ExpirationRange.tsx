import { useState } from "react";
import { Listbox } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { CheckIcon } from "@heroicons/react/16/solid";

const options: { value: ExpirationRangeOption; label: string }[] = [
  { value: "ANYTIME", label: "Anytime" },
  { value: 7, label: "7 days" },
  { value: 30, label: "30 days" },
  { value: 90, label: "90 days" },
  { value: "CUSTOM", label: "Custom" },
];

export type ExpirationRangeOption = "ANYTIME" | "CUSTOM" | number;

export default function ExpirationRange() {
  const [selected, setSelected] = useState(options[0]);

  return (
    <div className="flex items-end gap-2">
      <Listbox name="expires-within" value={selected} onChange={setSelected}>
        <div className="relative grow">
          <Listbox.Label className="text-xs text-gray-200 font-medium">Expires within</Listbox.Label>
          <Listbox.Button className="relative mt-1 w-full cursor-default rounded-md border border-gray-600 py-2 pl-3 pr-10 text-left focus:outline-none focus-visible:border-gray-300 focus-visible:ring-none sm:text-sm">
            <span className="block truncate">{selected.label}</span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </span>
          </Listbox.Button>
          <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-gray-800 py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
            {options.map((option) => (
              <Listbox.Option
                key={option.value}
                className="relative cursor-default select-none py-2 pr-5 pl-2 ui-active:bg-gray-700 text-gray-200"
                value={option}
              >
                <span className="flex gap-1 items-center">
                  <CheckIcon className="hidden size-4 ui-selected:block" />
                  <span className="pl-5 ui-selected:pl-0 block truncate ui-selected:font-semibold font-normal ui-selected:text-gray-100">
                    {option.label}
                  </span>
                </span>
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      </Listbox>
      {selected.value === "CUSTOM" && (
        <label className="flex items-center relative">
          <input
            size={4}
            maxLength={4}
            defaultValue={0}
            className="rounded-md pr-11 bg-gray-800 border border-gray-600 py-2 px-3 text-left focus:outline-none focus-visible:border-gray-400 focus-visible:ring-0 focus-visible:ring-gray-400 focus-visible:ring-offset-0 focus-visible:ring-offset-gray-400 sm:text-sm"
            name="expires-with-days"
          />
          <span className="text-sm absolute text-gray-400 right-0 w-11">days</span>
        </label>
      )}
    </div>
  );
}
