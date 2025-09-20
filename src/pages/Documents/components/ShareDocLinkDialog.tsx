import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ICollaborator } from "@/interface/ICollaborator";
import { IDocument } from "@/interface/IDocument";
import { CopyIcon } from "lucide-react";
import { useMemo } from "react";

interface ShareForm {
  selectedParticipant: string;
  permissionLevel: string;
  collaborators: ICollaborator[];
}

interface ShareDocLinkDialogProps {
  open: boolean;
  isLoading: boolean;
  shareDocument?: (collaborators: ICollaborator[]) => void;
  setOpen: (open: boolean) => void;
  selectedDocument: IDocument | null;
}

const ShareDocLinkDialog = ({
  open,
  isLoading,
  setOpen,
  shareDocument,
  selectedDocument,
}: ShareDocLinkDialogProps) => {
  const link = useMemo;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent title="">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <h2 className="font-medium">Share Link</h2>
          </div>
          <div>
            <Input type="text" />
            <Button>
              <CopyIcon className="w-24 h-24" />
            </Button>
          </div>
          <div>
            <Input type="text" />
            <Button>
              <CopyIcon className="w-24 h-24" />
            </Button>
          </div>
        </div>
        <div className="flex justify-end items-center gap-2 mt-4">
          <Button type="button" onClick={() => {}} variant="secondary">
            Generate
          </Button>
        </div>
        <Separator className="mx-2 my-4 w-auto bg-sidebar-border" />
      </DialogContent>
    </Dialog>
  );
};

export default ShareDocLinkDialog;
