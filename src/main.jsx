import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Questions } from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <div className="container mx-auto p-7">
      <Questions />
    </div>
  </StrictMode>
);
