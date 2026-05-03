import { createRoot } from "react-dom/client";
import "@/index.css";
import { RouterProvider } from "react-router";
import { Provider } from "react-redux";
import store from "@/app/store";
import { router } from "@/app/routes";
import { PlayerProvider } from "@/features/player/contexts/PlayerContext";

createRoot(document.getElementById("root")).render(
    <Provider store={store}>
        <PlayerProvider>
            <RouterProvider router={router} />
        </PlayerProvider>
    </Provider>
);
