import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

import type { RootState } from "@/app/store";

type ProtectedProps = {
  children: ReactNode;
  authenticationRequired?: boolean;
  notAuthenticationRequired?: boolean;
};

export default function Protected({ 
  children,
  authenticationRequired = true,
  notAuthenticationRequired = false,
}: ProtectedProps) {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(true);
  const authStatus = useSelector((state: RootState) => state.auth.status);

  useEffect(() => {
    if (authStatus === null) return; // wait for authStatus to be determined

    if (authenticationRequired === true && authStatus === false) {
      navigate("/login");
      setLoader(false);
      return;
    }
    if( notAuthenticationRequired === true && authStatus === true) {
      navigate("/");
      setLoader(false);
      return;
    }

    setLoader(false);
  }, [authStatus, notAuthenticationRequired, navigate, authenticationRequired]);

  return loader ? (
    <h1 className="w-full text-center">Loading...</h1>
  ) : (
    <>{children}</>
  );
}
