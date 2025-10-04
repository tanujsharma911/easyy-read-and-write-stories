import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { useSelector } from "react-redux";
import type { RootState } from "../app/store";
import { LoaderCircleIcon } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";

import commentServices from "@/supabase/comment";
import CommentTile from "./ui/CommentTile";

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

interface CommentType {
  id: string;
  created_at: string;
  message: string;
  user_id: string;
  post_id: string;
  parent_comment_id?: string;
  user_name: string;
  user_avatar?: string;
}

const schema = z.object({
  message: z
    .string()
    .min(2, { message: "Message must be at least 2 characters." }),
  user_id: z.string(),
  post_id: z.string(),
  parent_comment_id: z.string().optional(),
  user_name: z.string(),
  user_avatar: z.string().optional(),
});

type Comment = z.infer<typeof schema> & { parent_comment_id?: string | number };

const CommentSection = ({ postId }: { postId: string | undefined }) => {
  const isUserLoggedin = useSelector<RootState, boolean | null>(
    (state) => state.auth.status
  );
  const userData = useSelector<RootState, UserData | null>(
    (state) => state.auth.userData
  );
  const queryClient = useQueryClient();

  const createCommentForm = useForm<Comment>({
    resolver: zodResolver(schema),
    defaultValues: {
      message: "",
      user_id: "",
      post_id: "",
      user_name: "",
      user_avatar: "",
      parent_comment_id: undefined,
    },
  });

  const postComment = useMutation({
    mutationFn: (values: Comment) => {
      return commentServices.createComment(values);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      createCommentForm.reset();
      toast.success("Comment posted successfully!");
    },
  });

  function onSubmit(values: Comment) {
    values.post_id = postId || "";
    values.user_id = userData?.id || "";
    values.user_name = userData?.user_metadata.full_name || "Unknown User";
    values.user_avatar = userData?.user_metadata.avatar_url || "";

    postComment.mutate(values);
  }

  const comments = useQuery({
    queryKey: ["comments", postId],
    queryFn: () => {
      return commentServices.getCommentsByPostId(postId || "");
    },

    enabled: !!postId,
    refetchOnWindowFocus: false,
  });

  const commentTree = ((
    flatComments: CommentType[]
  ): (CommentType & { children?: CommentType[] })[] => {
    const commentMap = new Map<
      string,
      CommentType & { children?: CommentType[] }
    >();
    const roots: (CommentType & { children?: CommentType[] })[] = [];

    flatComments.forEach((comment) => {
      commentMap.set(comment.id, { ...comment, children: [] });
    });

    flatComments.forEach((comment) => {
      if (comment.parent_comment_id) {
        const parent = commentMap.get(comment.parent_comment_id);
        if (parent) {
          parent.children!.push(commentMap.get(comment.id)!);
        }
      } else {
        roots.push(commentMap.get(comment.id)!);
      }
    });

    // console.log(roots);
    return roots;
  })(comments.data || []);

  return (
    <div className="my-10">
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
        Comments
      </h3>

      <hr className="mt-4 mb-8" />

      {/* Comment Form */}
      {isUserLoggedin && (
        <div className="my-4 flex gap-2">
          <img
            src={userData?.user_metadata.avatar_url}
            alt={userData?.user_metadata.full_name}
            referrerPolicy="no-referrer"
            className="h-8 w-8 rounded-full"
          />
          <Form {...createCommentForm}>
            <form
              onSubmit={createCommentForm.handleSubmit(onSubmit)}
              className="space-y-6 flex gap-2 w-full"
            >
              <FormField
                control={createCommentForm.control}
                name="message"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input placeholder="Enter your comment..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={postComment.isPending}>
                {postComment.isPending && (
                  <LoaderCircleIcon className="animate-spin" />
                )}
                {postComment.isPending ? "Posting..." : "Submit"}
              </Button>
            </form>
          </Form>
        </div>
      )}

      {/* Comments List */}
      <div className="mt-6 space-y-8">
        {!comments.data ? (
          <p className="my-10 text-center text-gray-500">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          commentTree.map((comment) => (
            <CommentTile
              key={comment.id}
              comment={comment}
              isUserLoggedin={isUserLoggedin}
              userData={userData}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;
