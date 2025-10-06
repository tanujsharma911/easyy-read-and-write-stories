import { Link } from "react-router";
// import { Badge } from "@/components/ui/badge";
import { ArrowBigUp, MessageCircle } from "lucide-react";
import parse from "html-react-parser";
import { Card, CardContent } from "@/components/ui/card";
import { ClockIcon } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

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
  like_count?: number;
  comment_count?: number;
};

const PostCard = ({
  post,
  hideInteractions = false,
}: {
  post: Post;
  hideInteractions?: boolean;
}) => {
  return (
    <Link key={post?.slug} to={`/articles/${post?.slug}`}>
      <Card className="bg-transparent flex flex-col sm:flex-row sm:items-center justify-between shadow-none overflow-hidden rounded-md border-none py-0">
        <CardContent className="p-0 flex flex-col">
          <div className="flex items-center gap-2">
            <img
              src={post?.user_avatar}
              alt={post?.user_name}
              width={23}
              referrerPolicy="no-referrer"
              className="rounded-full"
            />
            <p className="text-[14px] text-gray-500">{post?.user_name}</p>
          </div>
          <div className="flex items-center gap-6">
            {/* <Badge className="bg-primary/5 text-primary hover:bg-primary/5 shadow-none">
              Technology
            </Badge> */}
          </div>
          <h3 className="mt-4 text-2xl font-semibold tracking-tight">
            {post?.title}
          </h3>
          <div className="mt-2 flex text-muted-foreground line-clamp-3 text-ellipsis">
            {parse(
              post?.content.substring(0, 100) +
                (post?.content.length > 100 ? "..." : "")
            )}
          </div>
          <div className="mt-4 flex items-center gap-6 text-muted-foreground text-sm font-medium">
            <div className="flex items-center gap-2">
              <ClockIcon size={18} />
              {dayjs(post?.created_at).fromNow()}
            </div>
            {!hideInteractions && (
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <ArrowBigUp size={18} /> {post?.like_count || 0}
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle size={18} /> {post?.comment_count || 0}
                </div>
              </div>
            )}
          </div>
        </CardContent>
        <div>
          <img
            src={post?.image_url}
            alt={post?.title}
            style={{ width: "200px" }}
          />
        </div>
      </Card>
    </Link>
  );
};

export default PostCard;
