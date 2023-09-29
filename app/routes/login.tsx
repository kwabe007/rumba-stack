import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Link, useSearchParams} from "@remix-run/react";
import { createUserSession, getUserId } from "~/session.server";
import { safeRedirect } from "~/utils";
import { verifyLogin } from "~/domains/users/user-queries.server";
import Input from "~/components/Input";
import {useField, ValidatedForm, validationError} from "remix-validated-form";
import {withZod} from "@remix-validated-form/with-zod";
import {UserInputSchema} from "~/domains/users/user-schema";
import {z} from "zod";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await getUserId(request);
  if (userId) return redirect("/");
  return json({});
};

const validator = withZod(
  UserInputSchema.extend({
    redirectTo: z.string().default(""),
    remember: z.string().optional(),
  })
);

export const action = async ({ request }: ActionFunctionArgs) => {
  const result = await validator.validate(
    await request.formData()
  );

  if (result.error) {
    // validationError comes from `remix-validated-form`
    return validationError(result.error);
  }

  const {email, password, remember} = result.data;
  const redirectTo = safeRedirect(result.data.redirectTo);

  const user = await verifyLogin(email, password);

  if (!user) {
    return validationError(
      {
        fieldErrors: {
          form: "Wrong email or password",
        }
      }
    )
  }

  return createUserSession({
    redirectTo,
    remember: remember === "on",
    request,
    userId: user._id,
  });
};

export const meta: MetaFunction = () => [{ title: "Login" }];

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/";
  const {error} = useField("form", { formId: "login" });

  return (
    <div className="flex min-h-full flex-col justify-center">
      <div className="mx-auto w-full max-w-md px-8 pt-16">
        <ValidatedForm id="login" validator={validator} method="post" className="space-y-2">
          <Input name="email" label="Email address" />
          <Input name="password" label="Password" type="password" />
          <input type="hidden" name="redirectTo" value={redirectTo} />
          <button
            type="submit"
            className="w-full rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
          >
            Log in
          </button>
          {error && (
            <div className="text-red-700 text-sm">{error}</div>
          )}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember"
                name="remember"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor="remember"
                className="ml-2 block text-sm"
              >
                Remember me
              </label>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="text-center text-sm text-gray-500">
              Don't have an account?{" "}
              <Link
                className="text-blue-500 underline"
                to={{
                  pathname: "/register",
                  search: searchParams.toString(),
                }}
              >
                Register
              </Link>
            </div>
          </div>
        </ValidatedForm>
      </div>
    </div>
  );
}