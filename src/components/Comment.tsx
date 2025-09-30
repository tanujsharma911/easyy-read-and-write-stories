import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

const Vote = () => (
  <div>
    <Button
      variant="outline"
      className="rounded-none first:rounded-l-md last:rounded-r-md gap-1 px-3.5 font-semibold"
    >
      <MessageCircle className="h-5! w-5!" /> 4
    </Button>
  </div>
);
export default Vote;
