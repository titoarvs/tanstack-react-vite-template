import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.tsx"
import { initTheme } from "./features/settings/applyTheme"
import "./index.css"

initTheme()

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
