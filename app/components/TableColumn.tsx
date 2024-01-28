import { ReactNode } from "react";

export function Column({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <th
      scope="col"
      className={`py-3.5 px-3 first:pl-4 last:pr-4 sm:last:pr-6 text-left text-sm text-gray-100 sm:first:pl-6 ${className}`}
    >
      <button className="inline-flex font-semibold font group">
        {children}
        <span className={`${"text-gray-600 group-hover:visible invisible"} flex-none ml-2 rounded`}></span>
      </button>
    </th>
  );
}
