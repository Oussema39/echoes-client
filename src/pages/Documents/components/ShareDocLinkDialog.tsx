import SelectInput from "@/components/form/SelectInput";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ICollaborator } from "@/interface/ICollaborator";
import { IDocument } from "@/interface/IDocument";
import { TPermissionLevel } from "@/utils/constants";
import { permissionLevels } from "@/utils/selectOptions";
import { CopyIcon, LinkIcon } from "lucide-react";
import { useState } from "react";

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
  const [permission, setPermission] = useState<`${TPermissionLevel}`>(
    TPermissionLevel.VIEWER
  );

  const handleChangePermission = (permission: string) => {
    setPermission(permission as TPermissionLevel);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent title="">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <h2 className="font-medium">Share Link</h2>
          </div>
          <div className="flex gap-2">
            <Input
              type="text"
              className="!ring-0 !shadow-none select-text"
              value={crypto.randomUUID().toString()}
              readOnly
            />
            <Button>
              <CopyIcon className="w-24 h-24" />
            </Button>
          </div>
          <div className="flex items-center bg-slate-100 p-2">
            <LinkIcon className="w-24 h-24" />
            <p className="flex-1">Everybody with the link:</p>
            <div>
              <SelectInput
                options={permissionLevels}
                value={permission}
                onChange={handleChangePermission}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDocLinkDialog;
