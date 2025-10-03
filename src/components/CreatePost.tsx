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
import ImageCropComp from "./ImageCrop";
import { useState } from "react";
import { Loader2Icon } from "lucide-react";

// Local Imports
import postServices from "@/supabase/post";
import type { RootState } from "../app/store";
import RTE from "./RTE/RTE";

type Inputs = {
  title: string;
  content: string;
  visibility: "public" | "private";
  user_id?: string;
  user_name?: string;
  user_avatar?: string;
  image_url?: string;
  slug: string;
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

// Component
const CreatePost = () => {
  const navigate = useNavigate();
  const userData = useSelector((state: RootState) => state.auth.userData) as UserData | null;
  const [imageString, setImageString] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors }, control } = useForm<Inputs>({
    defaultValues: {
      title: "",
      content: "",
      visibility: "public",
    },
  });

  const createPost = useMutation({
    mutationFn: async ({image, filePath, data} : {image: File, filePath: string, data: Inputs}) => {

      // Upload image and set public URL
      const publicUrl = await postServices.uploadImage(image, filePath);
      data.image_url = publicUrl;

      // Create post
      await postServices.createPost(data);
      return data;
    },

    onSuccess: (data) => {
      toast.success("Post created successfully!");
      navigate(`/articles/${data.slug}`);
    },

    onError: () => {
      toast.error("Failed to create post. Please try again.");
    },
  });

  const base64ToFile = (base64: string, filename: string): File => {
    const arr = base64.split(",");
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  };
  const slugification = (title: string) => {
    return title
      .toLowerCase()                       // lowercase everything
      .normalize("NFD")                     // split accents from letters
      .replace(/[\u0300-\u036f]/g, "")      // remove accents
      .replace(/[^a-z0-9\s-]/g, "")         // remove special chars & emojis
      .trim()                               // trim spaces from start & end
      .replace(/\s+/g, "-")                 // replace spaces with -
      .replace(/-+/g, "-");                 // collapse multiple - into one
  };

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
    if (!imageString) {
      toast.error("Please add a cover image");
      return;
    }

    // Add user info to the post data
    if (!userData) return;
    data.user_id = userData.id;
    data.user_name = userData.user_metadata.full_name;
    data.user_avatar = userData.user_metadata.avatar_url;

    // convert base64(string) image into file
    const image = base64ToFile(imageString, "cover.jpg");

    // Generate slug from title
    data.slug = slugification(data.title);
    data.slug += `-${(new Date()).toLocaleDateString().replaceAll('/', '-')}`;

    // Upload image if exists
    const filePath = `${data.title}-${data.user_id}-${data.user_name}-${Date.now()}`;
    createPost.mutate({image, filePath, data});
  };

  return (
    <div>
      <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
        Create Article
      </h1>
      <form className="mt-10" onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-10">
          <p className="mb-2 text-xl">Cover Image</p>
          <ImageCropComp image={imageString} setImage={setImageString} />
        </div>

        <div>
          <input
            type="text"
            placeholder="Give Title to your article"
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
          <p className="mb-2">Visibility</p>
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

        <Button type="submit" disabled={createPost.isPending}>
          {createPost.isPending && <Loader2Icon className="animate-spin" />}
          {createPost.isPending ? "Creating..." : "Create Post"}
        </Button>
      </form>
    </div>
  );
};

export default CreatePost;
