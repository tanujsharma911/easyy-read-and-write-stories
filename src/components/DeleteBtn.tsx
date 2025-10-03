import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";

const DeleteBtn = ({ onDelete }: { onDelete: () => void }) => {
  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="rounded-none first:rounded-l-md last:rounded-r-md gap-1 px-3.5 font-semibold hover:border-red-300 hover:bg-red-600/20 hover:text-red-600"
        onClick={onDelete}
      >
        <Trash />
      </Button>
    </>
  );
};

export default DeleteBtn;
