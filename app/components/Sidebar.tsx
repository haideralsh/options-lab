import { Form } from "@remix-run/react";
import SymbolSelect from "./SymbolCombobox";
import ExpirationRange from "./ExpirationSelect";
import PercentageRange from "./PercentageSlider";

export default function Sidebar() {
  return (
    <div className="flex flex-col gap-3 pt-8 px-4 pb-4 bg-gray-900 h-screen sticky top-0">
      <h1 className="text-xl font-semibold text-gray-100">Options Lab</h1>

      <Form className="flex flex-col justify-between flex-grow" method="post">
        <div className="flex flex-col gap-3">
          <SymbolSelect />
          <PercentageRange />
          <ExpirationRange />
        </div>

        <button className="w-full bg-teal-800 text-white font-medium rounded-md focus:outline-gray-800 focus:outline-2 text-lg p-3 hover:bg-teal-700">
          Filter
        </button>
      </Form>
    </div>
  );
}
