import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, HashRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { FlowProvider } from "./context/FlowProvider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {import.meta.env.PROD ? (
      <HashRouter>
        <FlowProvider>
          <App />
        </FlowProvider>
      </HashRouter>
    ) : (
      <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <FlowProvider>
          <App />
        </FlowProvider>
      </BrowserRouter>
    )}
  </React.StrictMode>
);
