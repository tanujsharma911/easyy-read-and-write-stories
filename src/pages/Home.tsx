import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import { BackgroundPattern } from "../components/hero-06/background-pattern";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import type { RootState } from "../app/store";
import { Globe } from "@/components/ui/globe";

import Articles from "../components/Articles";

function Home() {
  const navigate = useNavigate();
  const userLoggedIn = useSelector((state: RootState) => state.auth.status);

  return !userLoggedIn ? (
    <div>
      <div className="flex items-center justify-center px-6">
        <BackgroundPattern />
        <div className="relative z-10 text-center max-w-3xl">
          <Badge
            variant="secondary"
            className="rounded-full mb-5 py-1 border-border"
            asChild
          >
            <p>
              Just released v1.0.0
            </p>
          </Badge>
          <div className="bg-background relative flex size-full w-full items-center justify-center overflow-hidden rounded-lg border pt-8 pb-40 md:pb-60">
            <h1 className="pointer-events-none w-full bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center mt-6 text-4xl sm:text-5xl md:text-6xl lg:text-7xl md:leading-[1.2] font-semibold tracking-tighter whitespace-pre-wrap text-transparent dark:from-white dark:to-slate-900/10">
              Your Story Matters
            </h1>
            <Globe className="top-15 sm:top-20 md:top-22 lg:top-25" />
            <div className="pointer-events-none absolute inset-0 h-full bg-[radial-gradient(circle_at_50%_200%,rgba(0,0,0,0.2),rgba(255,255,255,0))]" />
          </div>
          <p className="mt-6 md:text-lg">
            Write, share, and inspire. A space to publish your ideas and connect
            with readers worldwide.
          </p>
          <div className="mt-12 flex items-center justify-center gap-4">
            <Button
              onClick={() => navigate("/login")}
              size="lg"
              className="rounded-full text-base"
            >
              Start Reading <ArrowUpRight className="h-5! w-5!" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div>
      <Articles />
    </div>
  );
}

export default Home;
