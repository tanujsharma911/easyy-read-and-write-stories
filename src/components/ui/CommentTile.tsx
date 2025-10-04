import {
  ArrowRightIcon,
  Trash2Icon,
  LoaderCircleIcon,
  ChevronDown,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "./input";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import commentServices from "@/supabase/comment";

dayjs.extend(relativeTime);

interface CommentType {
  id: string;
  created_at: string;
  message: string;
  user_id: string;
  post_id: string;
  parent_comment_id?: string;
  user_name: string;
  user_avatar?: string;
  children?: CommentType[];
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
const schema = z.object({
  // Validation schema for reply form
  message: z
    .string()
    .min(2, { message: "Message must be at least 2 characters." }),
  user_id: z.string(),
  post_id: z.string(),
  parent_comment_id: z.number(),
  user_name: z.string(),
  user_avatar: z.string().optional(),
});
type Comment = z.infer<typeof schema> & { children?: Comment[] }; // Type for reply form data

const CommentTile = ({
  comment,
  isUserLoggedin,
  userData,
}: {
  comment: CommentType;
  isUserLoggedin: boolean | null;
  userData: UserData | null;
}) => {
  const [showReply, setShowReply] = useState(false);
  const [showReplies, setShowReplies] = useState(true);
  const queryClient = useQueryClient();

  const replyForm = useForm<Comment>({
    // Default values for reply form
    resolver: zodResolver(schema),
    defaultValues: {
      message: "",
      user_id: userData?.id || "",
      post_id: "",
      user_name: userData?.user_metadata.full_name || "",
      user_avatar: userData?.user_metadata.avatar_url || "",
      parent_comment_id: Number(comment.id),
    },
  });

  const sendReplyToServer = useMutation({
    mutationFn: async (data: Comment) => {

      await commentServices.createComment(data);
      return data;
    },
    onSuccess: () => {
      toast.success("Reply sent successfully!");
      replyForm.reset();
      setShowReply(false);
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
    onError: (error) => {
      console.error("Error sending reply:", error);
    },
  });

  function submitReply(values: Comment) {
    values.post_id = comment.post_id; // Set post_id from the parent comment
    sendReplyToServer.mutate(values);
  }

  const handleDeleteComment = useMutation({
    mutationFn: async (commentId: string) => {
      await commentServices.deleteComment(commentId);
      queryClient.invalidateQueries({ queryKey: ["comments"] });
      return commentId;
    },
  });

  return (
    <div>
      <div key={comment.id} className="flex gap-4">
        <Avatar className="size-8">
          <AvatarImage
            src={comment.user_avatar}
            alt={comment.user_name}
            referrerPolicy="no-referrer"
          />
          <AvatarFallback className="text-base font-medium bg-primary text-primary-foreground">
            {comment.user_name.charAt(0)}
          </AvatarFallback>
        </Avatar>

        <div className="flex flex-col w-full">
          {/* Comment details */}
          <div className="flex items-center gap-4">
            <div className="flex gap-4">
              <p className="text-sm font-semibold">{comment.user_name}</p>
              <p className="text-sm text-gray-500">
                {dayjs(comment.created_at).fromNow()}
              </p>
            </div>
          </div>
          <p className="mt-2 text-base">{comment.message}</p>

          {/* Reply Section only to others */}
          {showReply && isUserLoggedin && userData?.id !== comment.user_id && (
            <div className="flex items-center gap-2 mt-4 w-full">
              <Button
                variant="secondary"
                size="icon"
                className="size-8 aspect-square h-full"
                onClick={() => setShowReply(false)}
              >
                <X />
              </Button>
              <div className="w-full">
                <Form {...replyForm}>
                  <form
                    onSubmit={replyForm.handleSubmit(submitReply)}
                    className="space-y-6 flex gap-2 w-full"
                  >
                    <div className="flex items-center w-full gap-2">
                      <FormField
                        control={replyForm.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormControl>
                              <Input placeholder="Add reply..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="submit"
                        disabled={sendReplyToServer.isPending}
                      >
                        {sendReplyToServer.isPending && (
                          <LoaderCircleIcon className="animate-spin" />
                        )}
                        {sendReplyToServer.isPending ? "Sending..." : "Send"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
            </div>
          )}

          {/* Reply Button (show reply form) only to others */}
          {!showReply && isUserLoggedin && userData?.id !== comment.user_id && (
            <div>
              <Button
                variant={showReply ? "secondary" : "ghost"}
                className="group"
                onClick={() => setShowReply(!showReply)}
              >
                Reply
                <ArrowRightIcon className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </Button>
            </div>
          )}
        </div>

        {/* Delete Btn only for the user who posted the comment */}
        {isUserLoggedin && userData?.id === comment.user_id && (
          <div>
            <Button
              variant="outline"
              onClick={() => handleDeleteComment.mutate(comment.id)}
              disabled={handleDeleteComment.isPending}
              size="icon"
              className="hover:bg-destructive/10! text-destructive! border-destructive! focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40"
            >
              {handleDeleteComment.isPending && (
                <LoaderCircleIcon className="animate-spin" />
              )}
              <Trash2Icon />
            </Button>
          </div>
        )}
      </div>
      {comment.children && comment.children.length > 0 && (
        <Button
          variant="ghost"
          className="md:ml-8 mt-2"
          onClick={() => setShowReplies(!showReplies)}
        >
          <ChevronDown
            className={`transition-transform duration-200 ${
              showReplies ? "rotate-180" : "rotate-0"
            }`}
          />{" "}
          Replies
        </Button>
      )}

      {showReplies && comment.children && comment.children.length > 0 && (
        <div className="ml-2 md:ml-10 space-y-8 border-l-2 border-gray-200 pl-4">
          {comment.children.map((reply) => (
            <CommentTile
              key={reply.id}
              comment={reply}
              isUserLoggedin={isUserLoggedin}
              userData={userData}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentTile;
