import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import parse from "html-react-parser";

import postServices from "@/supabase/post";
import Vote from "@/components/VoteButtons";
import Comment from "@/components/Comment";

interface Post {
  id: string;
  title: string;
  content: string;
  visibility: "public" | "private";
  user_id?: string;
  user_name?: string;
  user_avatar?: string;
  image_url?: string;
  slug: string;
}

const Post = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        if (!slug) {
          toast.error("Slug is undefined");
          return;
        }
        if (slug.trim() === "") {
          toast.error("Slug is empty");
          return;
        }

        const post = await postServices.getPostBySlug(slug);
        setPost(post);
      } catch (error) {
        toast.error("Failed to fetch post");
        console.error("Error fetching post:", error);
      }
    };

    fetchPost();
  }, [slug]);

  return (
    <div>
      <img src={post?.image_url} alt={post?.title} />
      <h1>Title: {post?.title}</h1>
      <div id="blog_content">{post?.content && parse(post?.content)}</div>

      <div className="mt-6 flex items-center gap-4">
        <Vote postId={post?.id} />
        <Comment />
      </div>
    </div>
  );
};

export default Post;
