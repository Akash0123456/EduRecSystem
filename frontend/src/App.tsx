import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login } from "./screens/Login/Login";
import { Signup } from "./screens/Signup/Signup";
import { Frame } from "./screens/Frame/Frame";
import { ForgotPassword } from "./screens/ForgotPassword/ForgotPassword";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/frame" element={<Frame />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App; 