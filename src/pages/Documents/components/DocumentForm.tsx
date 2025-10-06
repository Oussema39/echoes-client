import { ArrowLeftRight, Download, Save, Share } from "lucide-react";
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
import { forwardRef, useEffect, useId, useState } from "react";
import { ICollaborator } from "@/interface/ICollaborator";
import { TDocDefaultActions } from "@/utils/constants";
import ShareDocLinkDialog from "./ShareDocLinkDialog";

type DocumentFormProps = {
  selectedDocument: IDocument | null;
  saveDocument?: (data: FormData) => void;
  shareDocument?: (collaborators: ICollaborator[]) => void;
  exportPdf?: (html: string) => Promise<void>;
  isLoading: boolean;
  isLoadingShare: boolean;
  isLoadingAIAction?: boolean;
  isLoadingGeneratePDF?: boolean;
  handleOnFocus: () => void;
  disabledActions?: string[];
};

type FormData = {
  title: string;
  content: string;
};

const DocumentForm = forwardRef(
  (
    {
      selectedDocument,
      saveDocument,
      shareDocument,
      exportPdf,
      isLoading,
      isLoadingShare,
      isLoadingAIAction,
      isLoadingGeneratePDF,
      handleOnFocus,
      disabledActions = [],
    }: DocumentFormProps,
    editorRef
  ) => {
    const formId = useId();
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
            id={`document-form-${formId}`}
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col h-full w-full bg-white rounded-lg shadow-subtle overflow-hidden animate-fade-in"
          >
            <header className="flex justify-between items-center px-6 py-3 border-b overflow-x-auto">
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
                  disabled={
                    isLoading ||
                    disabledActions.includes(TDocDefaultActions.SAVE)
                  }
                  type="submit"
                  variant="secondary"
                  size="md"
                  className="gap-1"
                >
                  <Save size={16} />
                  <span>Save</span>
                </Button>
                <Button
                  disabled={
                    isLoadingGeneratePDF ||
                    isLoading ||
                    disabledActions.includes(TDocDefaultActions.PRINT)
                  }
                  size="md"
                  className="gap-1"
                  type="button"
                  variant="secondary"
                  onClick={() => exportPdf(form.getValues().content)}
                >
                  <Download size={16} />
                  <span>Print</span>
                </Button>
                <Button
                  disabled={
                    isLoading ||
                    disabledActions.includes(TDocDefaultActions.SHARE)
                  }
                  size="md"
                  className="gap-1"
                  type="button"
                  onClick={() => setShareDialogOpen(true)}
                >
                  <Share size={16} />
                  <span>Share</span>
                </Button>
                <Button
                  disabled={
                    isLoading ||
                    disabledActions.includes(TDocDefaultActions.FOCUS)
                  }
                  size="md"
                  className="gap-1"
                  type="button"
                  variant="secondary"
                  onClick={handleOnFocus}
                >
                  <ArrowLeftRight size={16} />
                  <span>Focus</span>
                </Button>
              </div>
            </header>

            {/* Document Content Field */}
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => {
                return (
                  <FormControl>
                    <DocumentEditor
                      loading={isLoadingAIAction}
                      {...field}
                      ref={editorRef}
                    />
                  </FormControl>
                );
              }}
            />
          </form>
        </Form>
        {/* {shareDialogOpen ? (
          <ShareDialog
            open={shareDialogOpen}
            setOpen={setShareDialogOpen}
            shareDocument={shareDocument}
            selectedDocument={selectedDocument}
            isLoading={isLoadingShare}
          />
        ) : null} */}
        {shareDialogOpen ? (
          <ShareDocLinkDialog
            open={shareDialogOpen}
            setOpen={setShareDialogOpen}
          />
        ) : null}
      </>
    );
  }
);

export default DocumentForm;
