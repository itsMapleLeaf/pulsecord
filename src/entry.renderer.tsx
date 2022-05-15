import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { Root } from "./root"

createRoot(document.querySelector("#root")!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
