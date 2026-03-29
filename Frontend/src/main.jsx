import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router";
import { Provider } from "react-redux";
import store from "./redux/app.redux.jsx";
import { Router } from "./routes/Main.routes.jsx";

createRoot(document.getElementById("root")).render(
    <Provider store={store}>
        <RouterProvider router={Router} />
    </Provider>

);
