import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import { useDispatch } from "react-redux";

import type { RootState } from "../app/store";
import auth from "../supabase/auth";
import { logout } from "../store/authSlice";
import { useSelector } from "react-redux";

interface UserData {
  app_metadata: {
    provider: string;
    providers: string[];
  };
  aud: string;
  created_at: string;
  email: string;
  email_confirmed_at: string | null;
  id: string;
  last_sign_in_at: string;
  phone: string | null;
  phone_confirmed_at: string | null;
  role: string;
  updated_at: string;
  user_metadata: {
    avatar_url?: string | undefined;
    full_name?: string | undefined;
    avatar?: string | undefined;
    [key: string]: string | undefined; // For any additional metadata fields
  };
}

const Account = () => {
  const dispatch = useDispatch();
  const userData = useSelector<RootState, UserData | null>(
    (state) => state.auth.userData
  );
  // console.log("user data in account page: ", userData);

  const handleLogout = async () => {
    const result = await auth.signOut();
    console.log(result);
    if (result.status === "success") {
      dispatch(logout());
    }
  };

  return (
    <div>
      <Card className="shadow-none">
        <CardContent className="px-6 py-2">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage
                src={userData?.user_metadata?.avatar_url || "/placeholder.svg"}
                alt={userData?.user_metadata?.full_name || "User Avatar"}
              />
              <AvatarFallback>
                <User className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <h3 className="text-lg font- text-foreground truncate">
                {userData?.user_metadata?.full_name}
              </h3>
              <p className="text-xs text-muted-foreground truncate">
                {userData?.email}
              </p>
            </div>

            <Button
              variant="destructive"
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Account;
