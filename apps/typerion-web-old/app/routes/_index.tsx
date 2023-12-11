import type { MetaFunction } from "@remix-run/node";
import { Notebook } from "~/components/Notebook.client";
import { useIsMounted } from "~/hooks/hooks";

export const meta: MetaFunction = () => {
  return [
    { title: "Typerion" },
    {
      name: "A TypeScript notebook for prototyping, development, and sharing",
      content: "Welcome to Typerion!",
    },
  ];
};

export default function Index() {
  const isMounted = useIsMounted();

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Welcome to Remix</h1>
      <ul>
        <li>
          <a
            target="_blank"
            href="https://remix.run/tutorials/blog"
            rel="noreferrer"
          >
            15m Quickstart Blog Tutorial
          </a>
        </li>
        <li>
          <a
            target="_blank"
            href="https://remix.run/tutorials/jokes"
            rel="noreferrer"
          >
            Deep Dive Jokes App Tutorial
          </a>
        </li>
        <li>
          <a target="_blank" href="https://remix.run/docs" rel="noreferrer">
            Remix Docs
          </a>
        </li>
      </ul>
      {isMounted ? <Notebook /> : null}
    </div>
  );
}
