import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Logger from "./pages/logger";
import Dashboard from "./pages/Dashboard";
import "./styles/dark.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/logger" element={<Logger />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
