import { Outlet } from "react-router";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Toaster } from "sonner";

import Header from "./components/Header/Header";
import Footer from "./components/Footer";
import { login, logout } from "./store/authSlice";
import authService from "./supabase/auth";
import { BreadcrumbNav } from "./components/Header/Breadcrumb";

function App() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  const getUserSession = async () => {
    const userData = await authService.getSession();

    if (userData) {
      dispatch(login(userData));
    } else {
      dispatch(logout());
    }

    setLoading(false);
  };

  useEffect(() => {
    getUserSession();
  }, [dispatch]);

  return (
    <div>
      <header className="sticky top-0 w-full z-50  bg-white/70 dark:bg-black/10 backdrop-blur-lg">
        <Header />
      </header>

      <main className="mx-auto mb-20 px-5 md:px-20 lg:max-w-4xl w-full mt-10">
        <div className="my-10 w-full">
          <BreadcrumbNav />
        </div>
        {loading && (
          <div className="flex justify-center items-center h-90">
            <svg
              className="animate-spin"
              width={30}
              fill="#8b5cf6"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"
                opacity=".25"
              />
              <path d="M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.75,11,11,0,0,0-21.72,0A1.5,1.5,0,0,0,2.62,12h0a1.53,1.53,0,0,0,1.49-1.3A8,8,0,0,1,12,4Z">
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  dur="0.75s"
                  values="0 12 12;360 12 12"
                  repeatCount="indefinite"
                />
              </path>
            </svg>
          </div>
        )}
        {!loading && <Outlet />}
      </main>
      <Footer />

      <Toaster richColors />
    </div>
  );
}

export default App;
