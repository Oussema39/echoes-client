import { Save, Share } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import DocumentEditor from "../../../components/DocumentEditor/DocumentEditor";
import { IDocument } from "@/interface/IDocument";
import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "../../../components/ui/dialog";
import ShareDialog from "./ShareDialog";
import { ICollaborator } from "@/interface/ICollaborator";

type DocumentFormProps = {
  selectedDocument: IDocument | null;
  saveDocument?: (data: FormData) => void;
  shareDocument?: (collaborators: ICollaborator[]) => void;
  isLoading: boolean;
};

type FormData = {
  title: string;
  content: string;
};

const options = [];

const DocumentForm = ({
  selectedDocument,
  saveDocument,
  shareDocument,
  isLoading,
}: DocumentFormProps) => {
  const form = useForm<FormData>({
    defaultValues: {
      title: selectedDocument?.title || "",
      content: selectedDocument?.content || "",
    },
  });
  const [shareDialogOpen, setShareDialogOpen] = useState<boolean>(false);

  const onSubmit = (data: FormData) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    saveDocument && saveDocument(data);
  };

  useEffect(() => {
    form.reset({
      title: selectedDocument?.title || "",
      content: selectedDocument?.content || "",
    });
  }, [selectedDocument, form]);

  return (
    <>
      <Form {...form} key={selectedDocument?._id}>
        <form
          id="document-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col h-full w-full bg-white rounded-lg shadow-subtle overflow-hidden animate-fade-in"
        >
          <header className="flex justify-between items-center px-6 py-3 border-b">
            <div className="flex items-center gap-2">
              {/* Title Field */}
              <FormField
                control={form.control}
                name="title"
                rules={{ required: "Title is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <input
                        {...field}
                        type="text"
                        className="font-medium text-lg focus:outline-none focus:bg-muted/30 px-2 py-1 rounded"
                        placeholder="Document title"
                        aria-label="Document title"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                disabled={isLoading}
                type="submit"
                variant="outline"
                size="sm"
                className="gap-1"
              >
                <Save size={16} />
                <span>Save</span>
              </Button>
              <Button
                disabled={isLoading}
                size="sm"
                className="gap-1"
                type="button"
                onClick={() => setShareDialogOpen(true)}
              >
                <Share size={16} />
                <span>Share</span>
              </Button>
            </div>
          </header>

          {/* Document Content Field */}
          <FormField
            control={form.control}
            name="content"
            rules={{ required: "Content is required" }}
            render={({ field }) => {
              return (
                <FormControl>
                  <DocumentEditor {...field} />
                </FormControl>
              );
            }}
          />
        </form>
      </Form>
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <h2>Share with</h2>
            </div>
            <ShareDialog
              open={shareDialogOpen}
              setOpen={setShareDialogOpen}
              onSubmit={shareDocument}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DocumentForm;
