import { useForm, type SubmitHandler, Controller } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

import postServices from "@/supabase/post";
import type { RootState } from "../app/store";
import RTE from "./RTE/RTE";

type Inputs = {
  title: string;
  content: string;
  visibility: "public" | "private";
  created_by_id?: string;
  created_by_name?: string;
  created_by_avatar?: string;
};

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

const CreatePost = () => {
  const navigate = useNavigate();
  const userData = useSelector(
    (state: RootState) => state.auth.userData
  ) as UserData | null;

  const {
    register,
    handleSubmit,
    formState: { errors },
    control, // We'll use this for the Controller component
  } = useForm<Inputs>({
    // It's good practice to set default values
    defaultValues: {
      title: "",
      content: "",
      visibility: "public",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: {
      title: string;
      content: string;
      visibility: "public" | "private";
      created_by_id?: string;
      created_by_name?: string;
      created_by_avatar?: string;
    }) => postServices.createPost(data),

    onSuccess: (data) => {
      console.log("✅ Post created:", data);
      toast.success("Post created successfully!");
      navigate("/");
    },

    onError: (error: Error) => {
      console.error("❌ Failed to create post:", error.message);
    },
  });

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    // Ensure content is not empty
    if (data.visibility === undefined) {
      data.visibility = "public"; // Default to public if not set
    }
    if (data.content.length < 30) {
      toast.error("Content is too short", {
        description: "Content should be at least 30 characters",
      });
      return;
    }
    if (data.title.length < 5) {
      toast.error("Title is too short", {
        description: "Title should be at least 5 characters",
      });
      return;
    }
    if (data.title.length > 50) {
      toast.error("Title is too long", {
        description: "Title should be less than 50 characters",
      });
      return;
    }
    if (!userData) {
      toast.error("User not logged in");
      return;
    }

    data.created_by_id = userData.id;
    data.created_by_name = userData.user_metadata.full_name;
    data.created_by_avatar = userData.user_metadata.avatar_url;

    mutation.mutate(data);
    console.log(data);
  };

  return (
    <div>
      <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
        Create Article
      </h1>
      <form className="mt-10" onSubmit={handleSubmit(onSubmit)}>
        {/* Title Input (Correct as is) */}
        <div>
          <input
            type="text"
            placeholder="Title goes here..."
            maxLength={50}
            {...register("title", {
              required: "Title is required",
            })}
            className="w-full pb-2 text-3xl font-semibold tracking-tight first:mt-0 focus:outline-none"
          />
          {errors.title && (
            <p role="alert" className="text-red-500">
              {errors.title.message}
            </p>
          )}
        </div>

        <div className="my-5">
          <RTE name="content" control={control} defaultValue={""} />
        </div>

        <div className="mb-5">
          <Controller
            name="visibility"
            control={control}
            rules={{ required: "Please select a visibility option" }}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Visibility" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.visibility && (
            <p role="alert" className="mt-1 text-red-500">
              {errors.visibility.message}
            </p>
          )}
        </div>

        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Creating..." : "Create Post"}
        </Button>
      </form>
    </div>
  );
};

export default CreatePost;
