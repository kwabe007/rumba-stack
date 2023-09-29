import {MetaFunction} from "@remix-run/node";
import {Form, Link} from "@remix-run/react";
import {useOptionalUser} from "~/hooks";

export const meta: MetaFunction = () => [{title: "Remix Template Lite"}];

export default function IndexPage() {
  const user = useOptionalUser();

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">Remix Template Lite</h1>
      <p className="mb-8">
        This is a starter template for a Remix app.
      </p>
      {user ?
        <Form action="/logout" method="post">
          <p className="mb-4">You are logged in!</p>
          <button className="font-bold text-blue-500">Logout</button>
        </Form>
        :
        <div className="flex gap-4">
          <Link className="font-bold text-blue-500" to="/login">Login</Link>
          <Link className="font-bold text-blue-500" to="/register">Register</Link>
        </div>
      }
    </div>
  );
}