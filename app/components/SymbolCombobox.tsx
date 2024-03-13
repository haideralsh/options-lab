import { Combobox } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { useFetcher } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import { SearchResponse } from "~/routes/search";

export default function SymbolCombobox() {
  const [selectedSymbols, setSelectedSymbols] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const search = useFetcher<SearchResponse>();

  function handleSelect(symbols: string[]) {
    setInputValue("");
    setSelectedSymbols(symbols);
  }

  function removeSymbol(symbol: string) {
    const newSymbols = selectedSymbols.filter((candidate) => candidate !== symbol);
    setSelectedSymbols(newSymbols);
  }

  function removeAll() {
    setSelectedSymbols([]);
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
    <Combobox className="relative" as="div" name="symbols" value={selectedSymbols} onChange={handleSelect} multiple>
      <Combobox.Label className="text-xs text-gray-200 font-medium">Symbols</Combobox.Label>
      <div
        onKeyDown={() => {
          inputRef.current?.focus();
        }}
        tabIndex={0}
        role="button"
        onClick={() => {
          inputRef.current?.focus();
        }}
        className="border cursor-text w-full mt-1 text-white bg-gray-900 border-gray-600 py-2 px-3 rounded-md focus-within:border-gray-400 ui-open:rounded-b-none"
      >
        <span className="flex gap-2 flex-wrap">
          {selectedSymbols.map((symbol) => (
            <span
              key={symbol}
              className="inline-flex gap-1 items-center rounded-sm bg-gray-700 p-1 leading-3 text-sm text-nowrap text-white "
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
          <search.Form
              className="inline flex-grow" method="get" action="/search">
            <Combobox.Input
              placeholder={selectedSymbols.length ? undefined : "Enter a symbol..."}
              ref={inputRef}
              value={inputValue}
              size={selectedSymbols.length ? 4 : 30}
              name="q"
              className="border-0 outline-0 text-white bg-transparent placeholder:text-sm"
              onChange={(event) => {
                search.submit(event.currentTarget.form);
                setInputValue(event.target.value);
              }}
            />
          </search.Form>
          {selectedSymbols.length > 0 && (
            <button
              type="button"
              className="focus-visible:outline focus-visible:outline-teal-50 rounded-sm focus-visible:outline-1"
              onClick={() => {
                removeAll();
              }}
            >
              <XMarkIcon className="h-3 w-3" />
            </button>
          )}
        </span>
      </div>
      <Combobox.Options className="absolute w-full top-[100%] z-10 bg-gray-700 overflow-hidden rounded-md ui-open:rounded-t-none">
        {search.data?.symbols &&
          search.data?.symbols
            .filter((symbolDetails) => !selectedSymbols.includes(symbolDetails.symbol))
            .map((symbolDetails) => (
              <Combobox.Option
                className="ui-active:bg-gray-600 ui-active:text-white over:bg-gray-600 text-sm p-3 cursor-default"
                key={symbolDetails.symbol}
                value={symbolDetails.symbol}
              >
                <div className="flex flex-col">
                  <span>{symbolDetails.symbol}</span>
                  <span className="text-xs line-clamp-1">{symbolDetails.description}</span>
                </div>
              </Combobox.Option>
            ))}
      </Combobox.Options>
    </Combobox>
  );
}
