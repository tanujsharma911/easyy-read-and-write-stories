import { Button } from "@/components/ui/button";
import { ArrowBigDown, ArrowBigUp, Loader2Icon } from "lucide-react";
import { toast } from "sonner";
import type { RootState } from "../app/store";
import { useSelector } from "react-redux";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import voteService from "@/supabase/vote";
import { useState } from "react";

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

const Vote = ({ postId }: { postId: string | undefined }) => {
  const queryClient = useQueryClient();
  const isUserLoggedin = useSelector<RootState, boolean | null>(
    (state) => state.auth.status
  );

  const userData = useSelector<RootState, UserData | null>(
    (state) => state.auth.userData
  );
  const [upvote, setUpvote] = useState(0);
  const [downvote, setDownvote] = useState(0);
  const [userVote, setUserVote] = useState(0); // 1 for upvote, -1 for downvote, 0 for no vote

  // Fetching all votes & user vote and set it
  useQuery({
    queryKey: ["votes", postId],
    queryFn: async () => {
      if (!postId) {
        throw new Error("Post ID is undefined");
      }
      const votes = await voteService.getVotes(postId);

      setUpvote(votes.filter((vote) => vote.vote === 1).length);
      setDownvote(votes.filter((vote) => vote.vote === -1).length);

      if (votes && userData) {
        const existingVote = votes.find((vote) => vote.user_id === userData.id);
        setUserVote(existingVote.vote);
      }

      return votes;
    },
    refetchInterval: 10000,
    enabled: !!postId, // Only run the query if postId is defined
  });

  // Sending user vote to supabase
  const handleVote = async (
    voteValue: number,
    userId: string,
    postId: string
  ) => {
    if (!userId) {
      toast("You need to be logged in to vote");
      throw new Error("User not logged in");
    }

    const { exists, voteData } = await voteService.voteExists(postId, userId);

    if (exists) {
      if (voteData.vote === voteValue) {
        // If the existing vote is the same as the new vote, remove the vote
        setUserVote(0);
        await voteService.removeVote(voteData.id);
      } else {
        // If the existing vote is different, update the vote by removing the old one and adding the new one
        setUserVote(voteValue);
        await voteService.removeVote(voteData.id);
        await voteService.vote(postId, userId, voteValue);
      }
    } else {
      setUserVote(voteValue);
      await voteService.vote(postId, userId, voteValue);
    }

    return true;
  };

  const makeVote = useMutation({
    // Validating user and call handleVote
    mutationFn: async (voteValue: number) => {
      if (!isUserLoggedin) {
        toast("You need to be logged in to vote");
        throw new Error("User not logged in");
      }
      if (postId === undefined) {
        throw new Error("Post ID is undefined");
      }

      return handleVote(voteValue, userData!.id, postId);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["votes", postId] });
    },
  });

  if (!isUserLoggedin) {
    return (
      <div className="flex items-center gap-4">
        <div>
          <Button
            disabled
            variant="outline"
            className="rounded-none first:rounded-l-md last:rounded-r-md gap-1 px-3.5 font-semibold hover:bg-green-600/20 hover:text-green-600"
          >
            <ArrowBigUp className="h-5! w-5!" />
          </Button>
          <Button
            disabled
            variant="outline"
            className="rounded-none first:rounded-l-md font-semibold last:rounded-r-md hover:bg-rose-500/20 hover:text-rose-500"
          >
            <ArrowBigDown className="h-5! w-5!" />
          </Button>
        </div>
        <p className="text-muted-foreground">Log in to see votes</p>
      </div>
    );
  }
  return (
    <div className="[&>*+*]:border-l-0">
      <Button
        onClick={() => makeVote.mutate(1)}
        variant="outline"
        className="rounded-none first:rounded-l-md last:rounded-r-md gap-1 px-3.5 font-semibold hover:bg-green-600/20 hover:text-green-600"
      >
        <ArrowBigUp
          fill={userVote === 1 ? "currentColor" : "none"}
          className="h-5! w-5!"
        />

        {makeVote.isPending && <Loader2Icon className="animate-spin" />}
        {!makeVote.isPending && upvote}
      </Button>
      <Button
        onClick={() => makeVote.mutate(-1)}
        variant="outline"
        className="rounded-none first:rounded-l-md font-semibold last:rounded-r-md hover:bg-rose-500/20 hover:text-rose-500"
      >
        <ArrowBigDown
          fill={userVote === -1 ? "currentColor" : "none"}
          className="h-5! w-5!"
        />

        {makeVote.isPending && <Loader2Icon className="animate-spin" />}
        {!makeVote.isPending && downvote}
      </Button>
    </div>
  );
};
export default Vote;
