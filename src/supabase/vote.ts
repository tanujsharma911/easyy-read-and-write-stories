import supabase from "./supabase-client";

class VoteService {
    async removeVote(voteId: string) {
        try {
            const {error} = await supabase
                .from("votes")
                .delete()
                .eq("id", voteId);

            if (error) {
                throw new Error(error.message);
            }

            return true;
        } catch (error) {
            console.error("Error removing vote:", error);
            throw new Error("Failed to remove vote");
        }
    }

    async voteExists(postId: string, userId: string) {
        try {
            const {data: existingVote} = await supabase
                .from("votes")
                .select("*")
                .eq("post_id", postId)
                .eq("user_id", userId)
                .maybeSingle();

            if(existingVote){
                return {exists: true, voteData: existingVote};
            }
            else {
                // console.error("Error checking vote existence:", error);
                return { exists: false, voteData: null};
            }
        } catch (error) {
            console.error("Error checking vote existence:", error);
            throw new Error("Failed to check vote existence");
        }
    }

    async vote(postId: string, userId: string, voteValue: number) {

        try {
            const {error} = await supabase
                .from("votes")
                .insert({ post_id: postId, user_id: userId, vote: voteValue });

            if (error) {
                throw new Error(error.message);
            }

            return true;
        } catch (error) {
            console.error("Error upvoting:", error);
            throw new Error("Failed to upvote");
        }
    }

    async getVotes(postId: string | undefined) {
        try {
            const {data, error} = await supabase
                .from("votes")
                .select("*")
                .eq("post_id", postId);

            if (error) {
                throw new Error(error.message);
            }

            return data;
        } catch (error) {
            console.error("Error fetching votes:", error);
            throw new Error("Failed to fetch votes");
        }
    }
};

const voteService = new VoteService();

export default voteService;