import supabase from "./supabase-client";

export class PostServices {
    async createPost(data: {
        title: string;
        content: string;
        visibility: "public" | "private";
        created_by_id?: string;
        created_by_name?: string;
        created_by_avatar?: string;
    }) {
        const response = await supabase.from("articles").insert([
            {
                title: data.title,
                content: data.content,
                visibility: data.visibility,
                created_by_id: data.created_by_id,
                created_by_name: data.created_by_name,
                created_by_avatar: data.created_by_avatar,
            },
        ]);

        if (response.error) {
            throw new Error(response.error.message);
        }

        return response.data;
    }
};

const postServices = new PostServices();
export default postServices;