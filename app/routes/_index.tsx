import { MetaFunction} from "@remix-run/node";

export const meta: MetaFunction = () => [{ title: "Remix Template Lite" }];

export default function IndexPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">Remix Template Lite</h1>
      <p>
        This is a starter template for a Remix app.
      </p>
    </div>
  );
}