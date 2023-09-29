import {MetaFunction} from "@remix-run/node";
import {Link} from "@remix-run/react";

export const meta: MetaFunction = () => [{title: "Remix Template Lite"}];

export default function IndexPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">Remix Template Lite</h1>
      <p className="mb-8">
        This is a starter template for a Remix app.
      </p>
      <div className="flex gap-4">
        <Link className="font-bold text-blue-500" to="/login">Login</Link>
        <Link className="font-bold text-blue-500" to="/register">Register</Link>
      </div>
    </div>
  );
}