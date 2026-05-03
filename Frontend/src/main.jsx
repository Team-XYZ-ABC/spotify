import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router";
import { Provider } from "react-redux";
import store from "./redux/app.redux.jsx";
import { router } from "./routes/index.jsx";
import { PlayerProvider } from "./contexts/PlayerContext.jsx";

createRoot(document.getElementById("root")).render(
    <Provider store={store}>
        <PlayerProvider>
            <RouterProvider router={router} />
        </PlayerProvider>
    </Provider>
);
