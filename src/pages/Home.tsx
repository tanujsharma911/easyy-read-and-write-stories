import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import { BackgroundPattern } from "../components/hero-06/background-pattern";
import { Link } from "react-router";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import type { RootState } from "../app/store";

function Home() {
  const navigate = useNavigate();
  const userLoggedIn = useSelector((state: RootState) => state.auth.status);

  return !userLoggedIn ? (
    <div className="flex items-center justify-center px-6">
      <BackgroundPattern />
      <div className="relative z-10 text-center max-w-3xl">
        <Badge
          variant="secondary"
          className="rounded-full py-1 border-border"
          asChild
        >
          <Link to="#">
            Just released v1.0.0 <ArrowUpRight className="ml-1 size-4" />
          </Link>
        </Badge>
        <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl lg:text-7xl md:leading-[1.2] font-semibold tracking-tighter">
          Your Story Matters
        </h1>
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
  )
  : (
    <div>
      Logged in
    </div>
  );
}

export default Home;
