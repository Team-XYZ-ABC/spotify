import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Router } from "./routes/Main.routes.jsx";
import { RouterProvider } from "react-router";

createRoot(document.getElementById("root")).render(
    <RouterProvider router={Router}>
        <App />
    </RouterProvider>,
);
