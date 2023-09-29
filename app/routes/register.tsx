import type {ActionFunctionArgs, LoaderFunctionArgs, MetaFunction} from "@remix-run/node";
import {json, redirect} from "@remix-run/node";
import {Form, Link, useActionData, useSearchParams} from "@remix-run/react";
import {useEffect, useRef} from "react";
import {createUser, getUserByEmail} from "~/domains/users/user-queries.server";
import {createUserSession, getUserId} from "~/session.server";
import {safeRedirect, validateEmail} from "~/utils";
import {Role, UserInputSchema} from "~/domains/users/user-schema";
import {withZod} from "@remix-validated-form/with-zod";
import {ValidatedForm} from "remix-validated-form";
import Input from "~/components/Input";

export const loader = async ({request}: LoaderFunctionArgs) => {
  const userId = await getUserId(request);
  if (userId) return redirect("/");
  return json({});
};

const validator = withZod(UserInputSchema);

export const action = async ({request}: ActionFunctionArgs) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const redirectTo = safeRedirect(formData.get("redirectTo"), "/");

  if (!validateEmail(email)) {
    return json(
      {errors: {email: "Email is invalid", password: null}},
      {status: 400}
    );
  }

  if (typeof password !== "string" || password.length === 0) {
    return json(
      {errors: {email: null, password: "Password is required"}},
      {status: 400}
    );
  }

  if (password.length < 8) {
    return json(
      {errors: {email: null, password: "Password is too short"}},
      {status: 400}
    );
  }

  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return json(
      {
        errors: {
          email: "A user already exists with this email",
          password: null,
        },
      },
      {status: 400}
    );
  }

  const user = await createUser({email, password, role: Role.Member});

  return createUserSession({
    redirectTo,
    remember: false,
    request,
    userId: user._id,
  });
};

export const meta: MetaFunction = () => [{title: "Register"}];

export default function Join() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? undefined;
  const actionData = useActionData<typeof action>();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (actionData?.errors?.email) {
      emailRef.current?.focus();
    } else if (actionData?.errors?.password) {
      passwordRef.current?.focus();
    }
  }, [actionData]);

  return (
    <div className="flex min-h-full flex-col justify-center">
      <div className="mx-auto w-full max-w-md px-8 pt-16">
        <ValidatedForm validator={validator} method="post" className="space-y-2">
          <Input className="w-full" name="email" label="Email address"/>
          <Input className="w-full" name="password" label="Password" type="password" />
          <input type="hidden" name="redirectTo" value={redirectTo}/>
          <button
            type="submit"
            className="w-full rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
          >
            Create Account
          </button>
          <div className="flex items-center justify-center">
            <div className="text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link
                className="text-blue-500 underline"
                to={{
                  pathname: "/login",
                  search: searchParams.toString(),
                }}
              >
                Log in
              </Link>
            </div>
          </div>
        </ValidatedForm>
      </div>
    </div>
  );
}
