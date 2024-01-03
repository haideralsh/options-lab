import type { MetaFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Fragment, useState } from "react";

export const meta: MetaFunction = () => {
  return [{ title: "Options Lab" }, { name: "description", content: "Welcome to Remix!" }];
};

const people = [
  {
    name: "Yo",
    title: "Title",
    email: "myemail@email.com",
    role: "Some role",
  },
];

export const loader: LoaderFunction = async () => {
  let result;

  await fetch("https://options-lab.vercel.app/api/options", {
    body: JSON.stringify({
      symbols: ["UA", "NOK"],
      percentage: 4,
    }),
    method: "POST",
  })
    .then((res) => res.json())
    .then((res) => {
      result = res;
    })
    .catch(() => {
      result = { error: "There was an error" };
    });

  return json(result);
};

export default function Index() {
  const data = useLoaderData<typeof loader>();
  const [sort, setSort] = useState(null);
  const [sortProp, desc] = sort?.split(":") || [];
  const sortedPeople = [...people].sort((a, b) => {
    return desc ? b[sortProp]?.localeCompare(a[sortProp]) : a[sortProp]?.localeCompare(b[sortProp]);
  });

  const symbols = Object.keys(data);
  const optionsCount = Object.values(data).flat().length;

  const [expandedGroups, setExpandedGroups] = useState(new Set(symbols));

  const toggleGroup = (symbol: string) => {
    const updatedExpandedGroups = new Set(expandedGroups);
    updatedExpandedGroups.has(symbol) ? updatedExpandedGroups.delete(symbol) : updatedExpandedGroups.add(symbol);

    setExpandedGroups(updatedExpandedGroups);
  };

  // return JSON.stringify(data);

  if (data.error) {
    return (
      <div className="flex place-content-center items-center w-screen h-screen font-light text-2xl">{data.error}</div>
    );
  }

  return (
    <div className="max-w-6xl py-8 mx-auto lg:py-16">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-xl font-semibold text-gray-900">Option chains</h1>
            <p className="mt-2 text-sm text-gray-700">
              Showing {optionsCount} options for <span className="font-semibold">{symbols.join(", ")}</span>. Use the
              filters to narrow down your search.
            </p>
          </div>
        </div>
        <div className="flex flex-col mt-8">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="tabular-nums min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <SortableColumn currentSort={sort} prop="name" onClick={(prop) => setSort(prop)}>
                        Expiration date
                      </SortableColumn>
                      <SortableColumn currentSort={sort} prop="title" onClick={(prop) => setSort(prop)}>
                        Ask
                      </SortableColumn>
                      <SortableColumn currentSort={sort} prop="email" onClick={(prop) => setSort(prop)}>
                        Bid
                      </SortableColumn>
                      <SortableColumn
                        className="text-right"
                        currentSort={sort}
                        prop="role"
                        onClick={(prop) => setSort(prop)}
                      >
                        Percentage
                      </SortableColumn>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {Object.entries(data).map(([symbol, options]) => (
                      <Fragment key={symbol}>
                        <th
                          colSpan={4}
                          scope="colgroup"
                          className="bg-gray-100 text-gray-600 text-left py-2 pl-4 pr-3 text-sm font-medium whitespace-nowrap sm:pl-6"
                          onClick={() => toggleGroup(symbol)}
                          style={{ cursor: "pointer" }}
                        >
                          {symbol}
                        </th>

                        {expandedGroups.has(symbol) &&
                          options.map((option) => (
                            <tr key={option.symbol}>
                              <td className="py-4 pl-4 pr-3 text-sm text-gray-900 whitespace-nowrap sm:pl-6">
                                {option.expiration_date}
                              </td>
                              <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">{option.ask}</td>
                              <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">{option.bid}</td>
                              <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap text-right">
                                {option.percentage.toFixed(2)}%
                              </td>
                            </tr>
                          ))}
                      </Fragment>
                    ))}
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

function SortableColumn({ currentSort, prop, onClick, children, className }) {
  const [sortProp, desc] = currentSort?.split(":") || [];
  let newSort;

  if (prop !== sortProp) {
    newSort = prop;
  } else if (sortProp === prop && !desc) {
    newSort = `${prop}:desc`;
  } else {
    newSort = null;
  }

  return (
    <th
      scope="col"
      className={`py-3.5 px-3 first:pl-4 last:pr-4 sm:last:pr-6 text-left text-sm text-gray-900 sm:first:pl-6 ${className}`}
    >
      <button onClick={() => onClick(newSort)} className="inline-flex font-semibold font group">
        {children}
        <span
          className={`${
            sortProp === prop
              ? "text-gray-900 bg-gray-200 group-hover:bg-gray-300"
              : "text-gray-400 group-hover:visible invisible"
          } flex-none ml-2 rounded`}
        >
          {/*<ChevronDownIcon*/}
          {/*  className={`${*/}
          {/*    prop === sortProp && desc ? "rotate-180" : ""*/}
          {/*  } w-5 h-5`}*/}
          {/*  aria-hidden="true"*/}
          {/*/>*/}
        </span>
      </button>
    </th>
  );
}
