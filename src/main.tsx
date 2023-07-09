import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.scss";
import { store } from "./app/store.ts";
import { Provider as StoreProvider } from "react-redux";
import { HelmetProvider } from "react-helmet-async";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <StoreProvider store={store}>
      <App />
    </StoreProvider>
  </HelmetProvider>
);
