import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app";
import { Provider } from "react-redux";
import { store } from "./store/store";
import "./index.css";  // ← This imports Tailwind

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
  </Provider>
);