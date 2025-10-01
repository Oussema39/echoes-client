import { generateDocumentShareLink } from "@/api/documentsApi";
import SelectInput from "@/components/form/SelectInput";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useDocuments } from "@/hooks/useDocuments";
import { TPermissionLevel } from "@/utils/constants";
import { permissionLevels } from "@/utils/selectOptions";
import { useQuery } from "@tanstack/react-query";
import { CopyIcon, LinkIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

interface ShareDocLinkDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const ShareDocLinkDialog = ({ open, setOpen }: ShareDocLinkDialogProps) => {
  const { selectedDocument, updateSelectedDocumentById } = useDocuments();

  const [permission, setPermission] = useState<`${TPermissionLevel}`>(
    TPermissionLevel.VIEWER
  );

  const { data, isLoading, error, isSuccess } = useQuery({
    queryKey: ["shareId"],
    queryFn: () => generateDocumentShareLink(selectedDocument._id, permission),
    enabled: !selectedDocument.shareLinks?.length,
  });

  const shareId = useMemo(() => {
    if (isLoading) return null;
    if (selectedDocument.shareLinks?.length)
      return selectedDocument.shareLinks?.[0]?.shareId;
    return data.shareLinks?.length[0];
  }, [isLoading, data, selectedDocument]);

  const handleChangePermission = (permission: string) => {
    setPermission(permission as TPermissionLevel);
  };

  const handleCopy = async () => {
    const shareUrl = new URL(location.href);
    shareUrl.searchParams.set("shareId", shareId);
    const shareLink = shareUrl.toString();
    await navigator.clipboard.writeText(shareLink);
    toast.info("Link copied");
  };

  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
  }, [error]);

  useEffect(() => {
    if (isSuccess) {
      updateSelectedDocumentById(selectedDocument._id, data);
    }
  }, [isSuccess, selectedDocument, data, updateSelectedDocumentById]);

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
              value={shareId}
              readOnly
              placeholder="***********"
            />
            <Button onClick={handleCopy}>
              <CopyIcon className="w-24 h-24" />
            </Button>
          </div>
          <div className="flex items-center bg-slate-100 p-2 gap-2">
            <LinkIcon className="w-5 h-5" />
            <p className="flex-1">Everybody with the link:</p>
            <div>
              <SelectInput
                options={permissionLevels}
                value={permission}
                onChange={handleChangePermission}
                disabled={Boolean(shareId) || isLoading}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDocLinkDialog;
