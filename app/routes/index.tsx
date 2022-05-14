import { useLoaderData } from "@remix-run/react"
import { json } from "@remix-run/server-runtime"
import { app } from "electron"

type LoaderData = {
  userDataPath: string
}

export function loader() {
  return json<LoaderData>({
    userDataPath: app.getPath("userData"),
  })
}

export default function Index() {
  const data = useLoaderData<LoaderData>()
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1>Welcome to Remix</h1>
      <p>{data.userDataPath}</p>
      <p>mode: {process.env.NODE_ENV}</p>
    </div>
  )
}
