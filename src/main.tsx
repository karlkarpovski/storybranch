import React from "react";
import ReactDOM from "react-dom/client";
import "@xyflow/react/dist/style.css";
import App from "./app/App";
import "./index.css";
import { ErrorBoundary } from "./app/ErrorBoundary";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);