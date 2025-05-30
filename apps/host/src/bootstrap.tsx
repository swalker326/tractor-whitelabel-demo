import React from "react";
import ReactDOM from "react-dom/client";
import { router } from "./router";
import "./index.css";
import { RouterProvider } from "react-router";
import { init } from "@module-federation/enhanced/runtime";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
