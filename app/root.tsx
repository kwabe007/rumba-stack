import { Links, LiveReload, Meta, Outlet, Scripts } from '@remix-run/react'
import { LinksFunction, LoaderFunctionArgs } from '@remix-run/node'

import tailwindStyles from './tailwind.css'
import { getUser } from '~/session.server'
import { typedjson } from 'remix-typedjson'

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: tailwindStyles },
]

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return typedjson({ user: await getUser(request) })
}

export default function App() {
  return (
    <html>
      <head>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="min-h-screen">
        <Outlet />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}
