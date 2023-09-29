import { useIsAdmin } from "~/hooks";
import {MetaFunction} from "@remix-run/node";

export const meta: MetaFunction = () => [{ title: "Remix Template Lite" }];

export default function IndexPage() {
  const isAdmin = useIsAdmin();

  return (
    <div>
      <h1>Remix Template Lite</h1>
      <p>
        This is a starter template for a Remix app.
      </p>
    </div>
  );
}