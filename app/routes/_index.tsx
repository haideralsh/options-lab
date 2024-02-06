import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import type { MetaFunction, ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import { Fragment, useEffect, useState } from "react";
import { ExpirationRangeOption } from "~/components/ExpirationRange";
import Sidebar from "~/components/Sidebar";
import { Column } from "~/components/TableColumn";

export const meta: MetaFunction = () => {
  return [{ title: "Options Lab" }, { name: "description", content: "Options Lab - explore option chains" }];
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const symbols = [];

  for (const [key, value] of formData.entries()) {
    if (key.startsWith("symbols")) {
      symbols.push(value);
    }
  }

  let expiresWithin;

  switch (formData.get("expires-within[value]") as ExpirationRangeOption) {
    case "ANYTIME":
      expiresWithin = undefined;
      break;

    case "CUSTOM":
      expiresWithin = formData.get("expires-with-days");
      break;

    default:
      expiresWithin = formData.get("expires-within[value]");
  }

  const requestBody = {
    symbols: symbols,
    expires_within_days: Number(expiresWithin),
    percentage: Number(formData.get("percentage")),
  };

  let result;

  console.log(requestBody);

  await fetch("https://options-lab.vercel.app/api/options", {
    body: JSON.stringify(requestBody),
    method: "POST",
  })
    .then((res) => res.json())
    .then((jsonResponse) => {
      result = jsonResponse;
    })
    .catch(() => {
      result = { error: "There was an error" };
    });

  return json(result);
};

const formatter = new Intl.ListFormat("en", {
  style: "long",
  type: "conjunction",
});

type OptionSymbol = string;
type ExpirationDate = string;
type OptionChain = {
  ask: number;
  ask_date: number;
  askexch: string;
  asksize: number;
  average_volume: number;
  bid: number;
  bid_date: number;
  bidexch: string;
  bidsize: number;
  change: number;
  change_percentage: number;
  close: number;
  contract_size: number;
  description: string;
  exch: string;
  expiration_date: string;
  expiration_type: string;
  high: number;
  last: number;
  last_volume: number;
  low: number;
  open: number;
  open_interest: number;
  option_type: string;
  percentage: number;
  prevclose: number;
  root_symbol: string;
  strike: number;
  symbol: string;
  trade_date: number;
  type: string;
  underlying: string;
  volume: number;
  week_52_high: number;
  week_52_low: number;
};

type Options = {
  [key: OptionSymbol]: {
    [key: ExpirationDate]: OptionChain[];
  };
};

export default function Index() {
  const data: Options = useActionData() || {};

  const symbols = Object.keys(data);

  const optionsCount = Object.values(data)
    .map((v) => Object.values(v))
    .map((arr) => arr.flat())
    .flat().length;

  const [expandedGroups, setExpandedGroups] = useState(new Set(symbols));

  const toggleGroup = (symbol: string) => {
    const updatedExpandedGroups = new Set(expandedGroups);
    updatedExpandedGroups.has(symbol) ? updatedExpandedGroups.delete(symbol) : updatedExpandedGroups.add(symbol);

    setExpandedGroups(updatedExpandedGroups);
  };

  // return JSON.stringify(data);
  const deps = JSON.stringify(symbols);

  useEffect(() => {
    setExpandedGroups(new Set(symbols));
  }, [deps]);

  if (data.error) {
    return (
      <div className="flex place-content-center items-center w-screen h-screen font-light text-2xl">{data.error}</div>
    );
  }

  return (
    <div className="grid grid-cols-[400px_1fr] relative bg-[repeating-linear-gradient(90deg, black, black 1px, white 1px, white 2px)]">
      <Sidebar />
      <div className="py-8 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            {/* <h1 className="text-xl font-semibold text-gray-100">Option chains</h1> */}
            <p className="mt-2 text-sm text-gray-300">
              Showing {optionsCount} options for <span className="font-semibold">{formatter.format(symbols)}</span>. Use
              the filters to narrow down your search.
            </p>
          </div>
        </div>
        <div className="flex flex-col mt-8">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="relative tabular-nums min-w-full divide-y divide-gray-800">
                  <thead className="bg-gray-900">
                    <tr>
                      <Column>Expiration date</Column>
                      <Column>Ask</Column>
                      <Column>Bid</Column>
                      <Column className="text-right">Percentage</Column>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-900 divide-y divide-gray-700">
                    {Object.entries(data).map(([symbol, options]) => {
                      return (
                        <Fragment key={symbol}>
                          <th
                            colSpan={4}
                            scope="colgroup"
                            className="sticky top-0 cursor-pointer bg-gray-800 m-1 text-gray-300 text-left py-2 pl-4 pr-3 text-sm font-medium whitespace-nowrap sm:pl-6"
                            onClick={() => toggleGroup(symbol)}
                          >
                            <div className="flex gap-1 items-center">
                              {expandedGroups.has(symbol) ? (
                                <ChevronDownIcon className="h-4 w-4 -ml-5" />
                              ) : (
                                <ChevronRightIcon className="h-4 w-4 -ml-5" />
                              )}
                              <span>{symbol}</span>
                            </div>
                          </th>

                          {expandedGroups.has(symbol) &&
                            Object.entries(options).map(([expirationDate, ops]) => {
                              return ops.map((option, index) => (
                                <tr key={option.symbol}>
                                  {index === 0 && (
                                    <td
                                      valign="top"
                                      rowSpan={ops.length}
                                      className="py-4 pl-4 pr-3 text-sm text-gray-100 whitespace-nowrap sm:pl-6"
                                    >
                                      {expirationDate}
                                    </td>
                                  )}
                                  <td className="px-3 py-4 text-sm text-gray-300 whitespace-nowrap">{option.ask}</td>
                                  <td className="px-3 py-4 text-sm text-gray-300 whitespace-nowrap">{option.bid}</td>
                                  <td className="px-3 py-4 pr-8 text-sm text-gray-300 whitespace-nowrap text-right">
                                    {option.percentage.toFixed(2)}%
                                  </td>
                                </tr>
                              ));
                            })}
                        </Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
