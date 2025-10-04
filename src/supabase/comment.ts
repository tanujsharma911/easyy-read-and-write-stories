import supabase from "./supabase-client";

class CommentServices {
    async createComment(data: {
        message: string;
        user_id: string;
        post_id: string;
        parent_comment_id?: string | number;
        user_name: string;
        user_avatar?: string;
    }) {
        const { error } = await supabase.from("comments").insert([data]);
        if (error) {
            throw error;
        }
        return true;
    }

    async getCommentsByPostId(postId: string) {
        const { data, error } = await supabase
            .from("comments")
            .select("*")
            .eq("post_id", postId)
            .order("created_at", { ascending: false });
        if (error) {
            throw error;
        }
        return data;
    }

    async deleteComment(commentId: string) {
        const { error } = await supabase
            .from("comments")
            .delete()
            .eq("id", commentId);
        if (error) {
            throw error;
        }
        return true;
    }
};

const commentServices = new CommentServices();
export default commentServices;