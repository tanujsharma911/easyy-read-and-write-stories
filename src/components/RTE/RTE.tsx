import { Editor } from "@tinymce/tinymce-react";
import { Controller } from "react-hook-form";

function RTE({
  control,
  defaultValue = "",
}: {
  name?: string;
  control?: any;
  defaultValue?: string;
}) {
  const apiKey = import.meta.env.VITE_TINYMCE_API_KEY;
  return (
    <div>
      <Controller
        control={control}
        name="content"
        render={({ field: { onChange } }) => (
          <Editor
            apiKey={apiKey}
            initialValue={defaultValue}
            init={{
              initialValue: defaultValue,
              menubar: true,
              plugins: [
                "advlist",
                "autolink",
                "lists",
                "link",
                "image",
                "charmap",
                "preview",
                "anchor",
                "searchreplace",
                "visualblocks",
                "code",
                "fullscreen",
                "insertdatetime",
                "media",
                "table",
                "code",
                "help",
                "wordcount",
              ],
              toolbar:
                "undo redo | blocks | " +
                "bold italic forecolor | alignleft aligncenter " +
                "alignright alignjustify | bullist numlist outdent indent | " +
                "removeformat | help",
              content_style:
                "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
            }}
            onEditorChange={onChange}
          />
        )}
      />
    </div>
  );
}

export default RTE;
