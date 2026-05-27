import React from "react";
import ReactDOM from "react-dom/client";
import { ErrorBoundary } from "react-error-boundary";
import App from "@/App";
import "@/styles/globals.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary fallbackRender={({ error, resetErrorBoundary }) => <App error={error} reset={resetErrorBoundary} />}>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
