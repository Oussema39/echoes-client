import UsersInput from "@/components/form/UsersInput";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { FormControl, FormField } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";

type ShareForm = {
  selectedParticipant: string;
  permissionLevel: string;
};

const ShareDialog = ({ open, setOpen, saveDocument }) => {
  const { handleSubmit, control } = useForm<ShareForm>({
    defaultValues: {
      selectedParticipant: "",
      permissionLevel: "viewer",
    },
  });

  const onSubmit = (values: ShareForm) => {
    saveDocument({
      userId: values.selectedParticipant,
      permissionLevel: values.permissionLevel,
    });
    // setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent title="">
        <form id="share-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <h2 className="font-medium">Share with</h2>
            </div>
            <FormField
              control={control}
              name="selectedParticipant"
              rules={{ required: "Participant is required" }}
              render={({ field }) => {
                const onChange = (value) => field.onChange(value);
                return (
                  <FormControl>
                    <UsersInput {...field} onChange={onChange} />;
                  </FormControl>
                );
              }}
            />
            <FormField
              control={control}
              name="selectedParticipant"
              rules={{ required: "Participant is required" }}
              render={({ field }) => {
                return (
                  <FormControl>
                    <SelectInput {...field} />
                  </FormControl>
                );
              }}
            />
          </div>
        </form>

        <Separator className="mx-2 my-4 w-auto bg-sidebar-border" />
        <DialogFooter>
          <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button size="sm" type="submit">
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDialog;
