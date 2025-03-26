import UsersInput from "@/components/form/UsersInput";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { useState } from "react";

const ShareDialog = ({ open, setOpen }) => {
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>(
    []
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <h2 className="font-medium">Share with</h2>
          </div>
          <UsersInput />
        </div>

        <DialogFooter>
          <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button size="sm">Share</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDialog;
