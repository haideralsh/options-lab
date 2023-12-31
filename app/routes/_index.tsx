import type {MetaFunction, LoaderFunction} from "@remix-run/node";
import { json } from "@remix-run/node"; // or cloudflare/deno

  import { useLoaderData } from "@remix-run/react";

export const meta: MetaFunction = () => {
    return [
        {title: "Options Lab"},
        {name: "description", content: "Welcome to Remix!"},
    ];
};

export const loader: LoaderFunction = async () => {
  let result
  await fetch("https://options-lab.vercel.app/api/options", {
        body: JSON.stringify({
            symbols: ["TSLA"],
            percentage: 12,
        }),
        method: "POST",
    })
      .then((res) => res.json())
  .then(res => {result = res})
  .catch(() => { result = {error: "There was an error"}})

  return json(result)
}

export default function Index() {
  const res = useLoaderData<typeof loader>();

    return (JSON.stringify(res));
}
