import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Box } from "./screens/Box";
import { Frame } from "./screens/Frame";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Box />} />
        <Route path="/dashboard" element={<Frame />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
