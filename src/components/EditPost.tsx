import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";

import PostForm from "./PostForm";
import postServices from "@/supabase/post";

const EditPost = () => {
  const { slug } = useParams<{ slug: string }>();

  const fecthPost = async () => {
    if (!slug) return null;
    const post = await postServices.getPostBySlug(slug);
    return post;
  };

  const { data: post, isSuccess } = useQuery({
    queryKey: ["post"],
    queryFn: async () => {
      const post = await fecthPost();
      if (!post) {
        throw new Error("Post not found");
      }
      return post;
    },

  });
//   console.log(post);

  return (
    <div>

      {isSuccess && <PostForm post={post} />}
    </div>
  );
};

export default EditPost;
