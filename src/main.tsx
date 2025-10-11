import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ThemeProvider as NextThemesProvider } from "next-themes";
// import type { ThemeProviderProps } from "next-themes/dist/types";
import "./index.css";

// Local imports
import { store } from "./app/store.ts";
import App from "./App.tsx";
import AuthLayout from "./components/AuthLayout.tsx";

// Pages import
import Home from "./pages/Home.tsx";
import LoginPage from "./pages/Login.tsx";
import CreatePost from "./pages/CreatePost.tsx";
import EditPost from "./components/EditPost.tsx";
import Account from "./pages/Account.tsx";
import Post from "./pages/Post.tsx";
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
        element: (
          <AuthLayout notAuthenticationRequired={true}>
            <LoginPage />
          </AuthLayout>
        ),
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
        path: "/create-article",
        element: (
          <AuthLayout authenticationRequired={true}>
            <CreatePost />
          </AuthLayout>
        ),
      },
      {
        path: "/edit-article/:slug",
        element: (
          <AuthLayout authenticationRequired={true}>
            <EditPost />
          </AuthLayout>
        ),
      },
      {
        path: "/articles/:slug",
        element: (
          <AuthLayout authenticationRequired={false}>
            <Post />
          </AuthLayout>
        ),
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <RouterProvider router={router} />
        </Provider>
      </QueryClientProvider>
    </NextThemesProvider>
  </StrictMode>
);
