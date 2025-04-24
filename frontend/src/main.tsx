import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Box } from "./screens/Box";
import { Frame } from "./screens/Frame";
import { About } from "./screens/About";
import { Settings } from "./screens/Settings";
import { ForgotPassword } from "./screens/ForgotPassword/ForgotPassword";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { SettingsProvider } from "./contexts/SettingsContext";
import "./index.css";
import 'katex/dist/katex.min.css';

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <SettingsProvider>
      <BrowserRouter>
        <Routes>
        <Route path="/" element={
          <ProtectedRoute requireAuth={false}>
            <Box />
          </ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Frame />
          </ProtectedRoute>
        } />
        <Route path="/about" element={
          <ProtectedRoute>
            <About />
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        } />
        <Route path="/forgot-password" element={
          <ProtectedRoute requireAuth={false}>
            <ForgotPassword />
          </ProtectedRoute>
        } />
        </Routes>
      </BrowserRouter>
    </SettingsProvider>
  </React.StrictMode>
);
