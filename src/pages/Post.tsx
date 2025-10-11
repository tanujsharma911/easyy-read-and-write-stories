import { useParams, useNavigate } from "react-router";
import { toast } from "sonner";
import parse from "html-react-parser";
import { Calendar, SquarePen } from "lucide-react";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import type { RootState } from "../app/store";
import postServices from "@/supabase/post";
import Vote from "@/components/VoteButtons";
import DeleteBtn from "@/components/DeleteBtn";
import CommentSection from "@/components/CommentSection";

interface Post {
  id: string;
  created_at: string;
  title: string;
  content: string;
  visibility: "public" | "private";
  user_id?: string;
  user_name?: string;
  user_avatar?: string;
  image_url?: string;
  slug: string;
}
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

const Post = () => {
  const { slug } = useParams<{ slug: string }>();
  // const [post, setPost] = useState<Post | null>(null);
  const navigate = useNavigate();

  const isUserLoggedin = useSelector<RootState, boolean | null>(
    (state) => state.auth.status
  );
  const userData = useSelector<RootState, UserData | null>(
    (state) => state.auth.userData
  );

  const { data: post, isPending } = useQuery({
    queryKey: ["post", slug],
    queryFn: async () => {
      if (!slug) {
        throw new Error("Slug is undefined");
      }
      if (slug.trim() === "") {
        throw new Error("Slug is empty");
      }
      return postServices.getPostBySlug(slug);
    },
  });

  const handleDeletePost = async () => {
    try {
      if (!post) {
        toast.error("Post is undefined");
        return;
      }

      await postServices.deletePost(post.id);
      toast.success("Post deleted successfully");
      navigate("/");
    } catch (error) {
      toast.error("Failed to delete post");
      console.error("Error deleting post:", error);
    }
  };

  return (
    <div>
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-balance">
        {isPending ? (
          <div className="animate-pulse w-full rounded-md h-10 bg-gray-200" />
        ) : (
          post?.title
        )}
      </h1>
      <div className="mt-8 mb-12 flex items-center gap-4">
        <Avatar>
          <AvatarImage
            src={post?.user_avatar}
            alt={post?.user_name}
            referrerPolicy="no-referrer"
          />
          <AvatarFallback className="text-xs"></AvatarFallback>
        </Avatar>
        {isPending ? (
          <div className="animate-pulse w-40 rounded-md h-6 bg-gray-200" />
        ) : (
          <p>{post?.user_name}</p>
        )}

        <p className="text-sm ml-5 flex gap-2 text-muted-foreground">
          <Calendar size={18} />
          {new Date(post?.created_at || "").toDateString()}
        </p>
      </div>
      {isPending ? (
        <div className="animate-pulse w-full rounded-md h-[350px] bg-gray-200" />
      ) : (
        <img src={post?.image_url} alt={post?.title} className="w-full" />
      )}
      <div id="blog_content" className="dark:text-gray-100">
        {post?.content && parse(post?.content)}
      </div>

      <div className="mt-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Vote postId={post?.id} />
          {/* <Comment /> */}
        </div>

        <div className="flex items-center gap-2">
          {isUserLoggedin && userData?.id === post?.user_id && (
            <div>
              <DeleteBtn onDelete={handleDeletePost} />
            </div>
          )}
          {isUserLoggedin && userData?.id === post?.user_id && (
            <div>
              <Button
                variant="outline"
                size="icon"
                className="rounded-none first:rounded-l-md last:rounded-r-md gap-1 px-3.5 font-semibold hover:border-sky-300 hover:bg-sky-600/20 hover:text-sky-600"
                onClick={() => navigate(`/edit-article/${post?.slug}`)}
              >
                <SquarePen />
              </Button>
            </div>
          )}
        </div>
      </div>

      <CommentSection postId={post?.id} />
    </div>
  );
};

export default Post;
