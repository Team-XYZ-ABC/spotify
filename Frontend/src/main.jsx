import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Router } from "./routes/Main.routes.jsx";
import { RouterProvider } from "react-router";
import { Provider } from "react-redux";
import store from "./redux/app.redux.jsx";

createRoot(document.getElementById("root")).render(
    <Provider store={store}>
    <RouterProvider router={Router}>
        <App />
    </RouterProvider>,
    </Provider>
);
