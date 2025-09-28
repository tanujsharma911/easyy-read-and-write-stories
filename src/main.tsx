import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import "./index.css";

// Local imports
import { store } from "./app/store.ts";
import App from "./App.tsx";
import AuthLayout from "./components/AuthLayout.tsx";

// Pages import
import Home from "./pages/Home.tsx";
import LoginPage from "./pages/Login.tsx";
import CreatePost from "./pages/CreatePost.tsx";
import Communities from "./pages/Communities.tsx";
import Account from "./pages/Account.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

// Define routes
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/account",
        element: (
          <AuthLayout authenticationRequired={true}>
            <Account />
          </AuthLayout>
        ),
      },
      {
        path: "/create",
        element: (
          <AuthLayout authenticationRequired={true}>
            <CreatePost />
          </AuthLayout>
        ),
      },
      {
        path: "/communities",
        element: (
          <AuthLayout authenticationRequired={true}>
            <Communities />
          </AuthLayout>
        ),
      },
      {
        path: "*",
        element: <NotFound />,
      }
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </QueryClientProvider>
  </StrictMode>
);
