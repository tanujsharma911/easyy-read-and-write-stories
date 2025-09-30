import { useQuery } from "@tanstack/react-query";
import { Fragment } from "react/jsx-runtime";

import postServices from "@/supabase/post";
import PostCard from "@/components/PostCard";

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

const fetchPosts = async () => {
  try {
    const posts = await postServices.getAllPosts();
    return posts;
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
};

const Articles = () => {
  const {
    data: posts = [],
    isLoading,
    isError,
  } = useQuery<Post[]>({
    queryKey: ["articles"],
    queryFn: fetchPosts,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-90">
        <svg
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
    );
  }

  if (isError) {
    return <div>Error loading posts.</div>;
  }

  return (
    <div>
      <h1 className="scroll-m-20 mb-10 text-center text-4xl font-extrabold tracking-tight text-balance">
        Articles
      </h1>
      <div>
        {posts.map((post, index) => {
          const isLast = index === posts.length - 1;

          return isLast ? (
            <PostCard {...post} key={post.slug} />
          ) : (
            <Fragment key={post.slug}>
              <PostCard {...post} />
              <hr className="my-8" />
            </Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default Articles;
