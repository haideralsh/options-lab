import { Combobox } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { useEffect, useRef, useState } from "react";

const defaultSymbols = ["TSLA", "UA", "NOK", "AAPL", "NVDA"];

export default function SymbolSelect() {
  const [selectedSymbols, setSelectedSymbols] = useState<typeof defaultSymbols>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSelect(symbols: typeof defaultSymbols) {
    setInputValue("");
    setSelectedSymbols(symbols);
  }

  function removeSymbol(symbol: string) {
    const newSymbols = selectedSymbols.filter((candidate) => candidate !== symbol);
    setSelectedSymbols(newSymbols);
  }

  useEffect(() => {
    const inputRefCopy = inputRef.current;
    function handleBackspace(e: KeyboardEvent) {
      if (selectedSymbols.length !== 0 && e.code === "Backspace" && inputValue === "") {
        setSelectedSymbols(selectedSymbols.slice(0, -1));
      }
    }

    inputRef.current?.addEventListener("keydown", handleBackspace);

    return () => {
      inputRefCopy?.removeEventListener("keydown", handleBackspace);
    };
  }, [selectedSymbols, inputValue]);

  return (
    <div>
      <Combobox name="symbols" value={selectedSymbols} onChange={handleSelect} multiple>
        <Combobox.Label className="text-xs text-gray-200 font-medium">Symbols</Combobox.Label>
        <div className="border w-full mt-1 text-white bg-gray-800 border-gray-600 py-2 px-3 rounded-md focus-within:border-gray-400 ui-open:rounded-b-none">
          <span className="flex gap-2 flex-wrap">
            {selectedSymbols.map((symbol) => (
              <span
                key={symbol}
                className="inline-flex gap-1 items-center rounded-sm bg-gray-600 p-1 leading-3 text-sm text-nowrap text-white "
              >
                <span>{symbol}</span>
                <button
                  type="button"
                  className="focus-visible:outline focus-visible:outline-teal-50 rounded-sm focus-visible:outline-1"
                  onClick={() => {
                    removeSymbol(symbol);
                  }}
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </span>
            ))}
            <Combobox.Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              size={4}
              className="flex-grow inline border-0 outline-0 text-white bg-gray-800 "
            />
          </span>
        </div>
        <Combobox.Options className="bg-gray-700 overflow-hidden rounded-md ui-open:rounded-t-none">
          {defaultSymbols
            .filter((symbol) => !selectedSymbols.includes(symbol))
            .map((symbol) => (
              <Combobox.Option
                className="ui-active:bg-gray-600 over:bg-gray-600 text-sm p-3 cursor-default"
                key={symbol}
                value={symbol}
              >
                {symbol}
              </Combobox.Option>
            ))}
        </Combobox.Options>
      </Combobox>
    </div>
  );
}
