import { Outlet } from "react-router";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import Header from "./components/Header/Header";
import supabase from "./supabase/supabase-client";
import { login } from "./store/authSlice";

function App() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) return;
      // console.log("user", session.user);
      dispatch(login(session.user));
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) return;
      // console.log("user", session.user);
      dispatch(login(session.user));
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  return loading ? (
    <div className="flex items-center justify-center h-screen">Loading...</div>
  ) : (
    <div>
      <Header />
      <div>
        <Outlet />
      </div>
    </div>
  );
}

export default App;
