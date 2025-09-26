import { useForm, type SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";

import RTE from "./RTE/RTE";

type Inputs = {
  title: string;
};

const CreatePost = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);

  return (
    <div>
      <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
        Create Article
      </h1>
      <form className="mt-10" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <input
            type="text"
            placeholder="Title goes here..."
            maxLength={50}
            {...register("title", {
              required: "Title is required",
              maxLength: {
                value: 50,
                message: "Title cannot exceed 50 characters",
              },
            })}
            className="w-full pb-2 text-3xl font-semibold tracking-tight first:mt-0 focus:outline-none focus-within:outline-0"
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

        <Button type="submit">Create Post</Button>
      </form>
    </div>
  );
};

export default CreatePost;
