import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { Form, Link, useActionData, useSearchParams } from '@remix-run/react'
import { createUser, getUserByEmail } from '~/domains/users/user-queries.server'
import { createUserSession, getUserIdFromSession } from '~/session.server'
import { safeRedirect } from '~/utils'
import { Role, UserInputSchema } from '~/domains/users/user-schema'
import { withZod } from '@remix-validated-form/with-zod'
import { ValidatedForm, validationError } from 'remix-validated-form'
import Input from '~/components/Input'
import { z } from 'zod'

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await getUserIdFromSession(request)
  if (userId) return redirect('/')
  return json({})
}

const validator = withZod(
  UserInputSchema.extend({
    redirectTo: z.string().default(''),
  })
)

export const action = async ({ request }: ActionFunctionArgs) => {
  const result = await validator.validate(await request.formData())

  if (result.error) {
    // validationError comes from `remix-validated-form`
    return validationError(result.error)
  }

  const { email, password } = result.data
  const redirectTo = safeRedirect(result.data.redirectTo)

  const existingUser = await getUserByEmail(email)
  if (existingUser) {
    return validationError(
      {
        fieldErrors: {
          email: 'Email already in use',
        },
      },
      result.data
    )
  }

  const user = await createUser({ email, password, role: Role.Member })

  return createUserSession({
    redirectTo,
    remember: false,
    request,
    userId: user._id,
  })
}

export const meta: MetaFunction = () => [{ title: 'Register' }]

export default function Join() {
  const [searchParams] = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') ?? undefined
  const actionData = useActionData<typeof action>()

  return (
    <div className="flex min-h-full flex-col justify-center">
      <div className="mx-auto w-full max-w-md px-8 pt-16">
        <ValidatedForm
          validator={validator}
          method="post"
          className="space-y-2"
        >
          <Input className="w-full" name="email" label="Email address" />
          <Input
            className="w-full"
            name="password"
            label="Password"
            type="password"
          />
          <input type="hidden" name="redirectTo" value={redirectTo} />
          <button
            type="submit"
            className="w-full rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
          >
            Create Account
          </button>
          <div className="flex items-center justify-center">
            <div className="text-center text-sm text-gray-500">
              Already have an account?{' '}
              <Link
                className="text-blue-500 underline"
                to={{
                  pathname: '/login',
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
  )
}
