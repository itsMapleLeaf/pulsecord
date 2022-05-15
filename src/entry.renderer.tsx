import { StrictMode, Suspense } from "react"
import { createRoot } from "react-dom/client"
import { Root } from "./root"

createRoot(document.querySelector("#root")!).render(
  <StrictMode>
    <Suspense>
      <Root />
    </Suspense>
  </StrictMode>,
)
