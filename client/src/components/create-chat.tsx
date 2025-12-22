import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { useRef, useState } from "react";
import { Loader } from "lucide-react";

const CreateChat = () => {
  const email = useRef(null);

  const [loading, setLoading] = useState<boolean>(false);

  const handleCreateChat = () => {
    setLoading(true);
    console.log(email.current?.value);
  };

  return (
    <Dialog>
      <DialogTrigger>
        <Button className="h-6 rounded-sm border-0">
          <Plus className="size-3" aria-hidden />
          <span className="text-[10px]">New</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Chat</DialogTitle>
          <DialogDescription>
            Enter the recipient&apos;s email, and click Connect.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-center flex-wrap">
          <Input className="" ref={email} id="email" name="email" />
        </div>
        {loading && <span className="text-xs flex items-center justify-center text-muted-foreground">Hang in there checking for user records </span>}
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" className="cursor-pointer">
              Cancel
            </Button>
          </DialogClose>

          <Button
            onClick={handleCreateChat}
            className="flex cursor-pointer"
            type="submit"
          >
            Connect {loading && <Loader className="animate-spin" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export { CreateChat };
