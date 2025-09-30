import { Link } from "react-router";
// import { Badge } from "@/components/ui/badge";
import parse from "html-react-parser";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";

import Time from "./ui/Time";

type Post = {
  created_at: string;
  title: string;
  content: string;
  visibility: "public" | "private";
  user_id?: string;
  user_name?: string;
  user_avatar?: string;
  image_url?: string;
  slug: string;
};

const PostCard = (post: Post) => {
  return (
    <Link to={`/articles/${post.slug}`} key={post.slug}>
      <Card className="bg-transparent flex flex-col sm:flex-row sm:items-center justify-between shadow-none overflow-hidden rounded-md border-none py-0">
        <CardContent className="p-0 flex flex-col">
          <div className="flex items-center gap-2">
            <img
              src={post.user_avatar}
              alt={post.user_name}
              width={22}
              className="rounded-full"
            />
            <p className="text-[14px] text-gray-500">{post.user_name}</p>
          </div>
          <div className="flex items-center gap-6">
            {/* <Badge className="bg-primary/5 text-primary hover:bg-primary/5 shadow-none">
              Technology
            </Badge> */}
          </div>
          <h3 className="mt-4 text-2xl font-semibold tracking-tight">
            {post.title}
          </h3>
          <div className="mt-2 flex text-muted-foreground line-clamp-3 text-ellipsis">
            {parse(
              post.content.substring(0, 70) +
                (post.content.length > 70 ? "..." : "")
            )}
          </div>
          <div className="mt-4 flex items-center gap-6 text-muted-foreground text-sm font-medium">
            <div className="flex items-center gap-2">
              <Time time={post.created_at} />
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />{" "}
              {new Date(post.created_at).toDateString()}
            </div>
          </div>
        </CardContent>
        <div>
          <img
            src={post.image_url}
            alt={post.title}
            style={{ maxWidth: "200px" }}
          />
        </div>
      </Card>
    </Link>
  );
};

export default PostCard;
