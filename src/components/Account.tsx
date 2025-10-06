import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import { useDispatch } from "react-redux";

import type { RootState } from "../app/store";
import auth from "../supabase/auth";
import { logout } from "../store/authSlice";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import postServices from "@/supabase/post";
import PostCard from "@/components/PostCard";
import { Fragment } from "react/jsx-runtime";

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

  const handleLogout = async () => {
    const result = await auth.signOut();
    if (result.status === "success") {
      dispatch(logout());
    }
  };

  const { data: userPosts, isPending } = useQuery({
    queryKey: ["userPosts", userData?.id],
    queryFn: async () => {
      if (!userData?.id) return [];

      const posts = await postServices.getAllUserPosts(userData.id);
      return posts;
    },
  });

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

      <h2 className="scroll-m-20 mt-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        Your Articles
      </h2>

      {isPending && (
        <div className="flex justify-center items-center h-60">
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

      <div className="mt-10">
        {userPosts?.length ? (
          userPosts.map((post, index) => {
            const isLast = index === userPosts.length - 1;

            return isLast ? (
              <PostCard post={post} hideInteractions />
            ) : (
              <Fragment key={post.slug}>
                <PostCard post={post} hideInteractions />
                <hr className="my-8" />
              </Fragment>
            );
          })
        ) : (
          <p>No articles found.</p>
        )}
      </div>
    </div>
  );
};

export default Account;
