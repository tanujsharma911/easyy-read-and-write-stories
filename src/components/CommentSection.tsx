import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { useSelector } from "react-redux";
import type { RootState } from "../app/store";
import { ArrowRightIcon } from "lucide-react";
import { useMutation } from "@tanstack/react-query";

import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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
  message: z
    .string()
    .min(2, { message: "Message must be at least 2 characters." }),
  user_id: z.string(),
  post_id: z.string(),
  parent_comment_id: z.string().optional(),
  user_name: z.string(),
  user_avatar: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const CommentSection = ({ postId }: { postId: string | undefined }) => {
  const userData = useSelector<RootState, UserData | null>(
    (state) => state.auth.userData
  );

  const testimonial = {
    id: 1,
    name: "John Doe",
    created_at: "3 Hours ago",
    company: "TechCorp",
    testimonial:
      "This product has completely transformed the way we work. The efficiency and ease of use are unmatched!",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
  };

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      message: "",
      user_id: userData?.id || "",
      post_id: postId || "",
    },
  });

  const postComment = useMutation({
    mutationFn: (values: FormData) => {
      // API call to post a comment
    }
  });

  function onSubmit(values: FormData) {
    values.post_id = postId || "";
    values.user_id = userData?.id || "";
    values.user_name = userData?.user_metadata.full_name || "Unknown User";
    values.user_avatar = userData?.user_metadata.avatar_url || "";

    postComment.mutate(values);
    console.log(values);
  }

  return (
    <div className="my-10">
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
        {postId} Comments
      </h3>

      <hr className="mt-4 mb-8" />

      <div className="my-4 flex gap-2">
        <img
          src={userData?.user_metadata.avatar_url}
          alt={userData?.user_metadata.full_name}
          referrerPolicy="no-referrer"
          className="h-8 w-8 rounded-full"
        />
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 flex gap-2 w-full"
          >
            <FormField
              control={form.control}
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

            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </div>

      <div>
        
        <div className="flex my-10 gap-4">
          <Avatar className="size-8">
            <AvatarFallback className="text-base font-medium bg-primary text-primary-foreground">
              {testimonial.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <div className="flex items-center gap-4">
              <div className="flex gap-4">
                <p className="text-sm font-semibold">{testimonial.name}</p>
                <p className="text-sm text-gray-500">
                  {testimonial.created_at}
                </p>
              </div>
            </div>
            <p className="mt-2 text-base">{testimonial.testimonial}</p>

            <div className="mt-2">
              <Button variant="ghost" className="group">
                Reply
                <ArrowRightIcon className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </Button>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default CommentSection;
