import { Outlet } from "react-router";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Toaster } from "sonner";

import Header from "./components/Header/Header";
import { login, logout } from "./store/authSlice";
import auth from "./supabase/auth";

function App() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    auth
      .getSession()
      .then((userData) => {
        if (userData) {
          const user = userData.user;
          dispatch(login(user));
        } else {
          dispatch(logout());
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [dispatch]);

  return loading ? (
    <div className="flex items-center justify-center h-screen">Loading...</div>
  ) : (
    <div>
      <div className="sticky top-0 w-full z-50  bg-white/70 backdrop-blur-lg">
        <Header />
      </div>

      <div className="mx-auto mb-20 px-5 md:px-20 lg:max-w-4xl w-full mt-10">
        <Outlet />
      </div>

      <Toaster richColors />
    </div>
  );
}

export default App;
