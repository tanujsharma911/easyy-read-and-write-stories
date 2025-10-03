import supabase from "./supabase-client";

type Post = {
    title: string;
    content: string;
    visibility: "public" | "private";
    user_id?: string;
    user_name?: string;
    user_avatar?: string;
    image_url?: string;
    slug: string;
};

export class PostServices {
    async createPost(data: Post) {
        try {
            const response = await supabase.from("articles").insert([data]);
            if (response.error) {
                throw new Error(response.error.message);
            }
            return response.data;
        } catch (error) {
            console.error("Error creating post:", error);
            throw new Error("Failed to create post");
        }

    }

    async uploadImage(image: File, filePath: string) {

        try {
            const { error } = await supabase.storage
                .from("post-images")
                .upload(filePath, image);
    
            if (error) {
                throw new Error(error.message);
            }
    
            const { data: publicURL } = supabase.storage
                .from("post-images")
                    .getPublicUrl(filePath);
    
            return publicURL.publicUrl;
            
        } catch (error) {
            console.error("Error uploading image:", error);
            throw new Error("Failed to upload image");
        }
    }

    async getAllPosts() {
        try {
            const { data, error } = await supabase
                .from("articles")
                .select("*")
                .order("created_at", { ascending: false });
    
            if (error) {
                throw new Error(error.message);
            }
    
            return data;
        } catch (error) {
            console.error("Error fetching posts:", error);
            throw new Error("Failed to fetch posts");
        }
    }

    async getPostBySlug(slug: string) {
        try {
            const { data, error } = await supabase
                .from("articles")
                .select("*")
                .eq("slug", slug)
                .single();
    
            if (error) {
                throw new Error(error.message);
            }
    
            return data;
        } catch (error) {
            console.error("Error fetching post:", error);
            throw new Error("Failed to fetch post");
        }
    }

    async deletePost(postId: string) {
        try {
            const { error } = await supabase
                .from("articles")
                .delete()
                .eq("id", postId);
    
            if (error) {
                throw new Error(error.message);
            }
    
            return true;
        } catch (error) {
            console.error("Error deleting post:", error);
            throw new Error("Failed to delete post");
        }
    }
};

const postServices = new PostServices();
export default postServices;