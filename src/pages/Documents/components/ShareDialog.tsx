import UserPermissionInput from "@/components/Cards/UserCard";
import SelectInput from "@/components/form/SelectInput";
import UsersInput from "@/components/form/UsersInput";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import useUserQuery from "@/hooks/users/useUserQuery";
import { ICollaborator } from "@/interface/ICollaborator";
import { IDocument } from "@/interface/IDocument";
import { TPermissionLevel } from "@/utils/constants";
import { permissionLevels } from "@/utils/selectOptions";
import { useCallback, useEffect, useMemo } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";

interface ShareForm {
  selectedParticipant: string;
  permissionLevel: string;
  collaborators: ICollaborator[];
}

interface ShareDialogProps {
  open: boolean;
  isLoading: boolean;
  shareDocument?: (collaborators: ICollaborator[]) => void;
  setOpen: (open: boolean) => void;
  selectedDocument: IDocument | null;
}

const ShareDialog = ({
  open,
  isLoading,
  setOpen,
  shareDocument,
  selectedDocument,
}: ShareDialogProps) => {
  const { usersMap, users } = useUserQuery();

  const form = useForm<ShareForm>({
    defaultValues: {
      selectedParticipant: "",
      permissionLevel: "viewer",
      collaborators: selectedDocument.collaborators ?? [],
    },
  });

  const formCollabs = form.watch("collaborators");

  const options = useMemo(() => {
    const usersOptions = users?.map((user) => ({
      label: `${user.firstName} ${user.lastName} | ${user.email}`,
      value: user._id,
    }));

    const selectedCollabsMap = new Map();

    if (!Array.isArray(formCollabs)) {
      return [];
    }

    for (const collab of formCollabs) {
      selectedCollabsMap.set(collab?.userId, collab?.permissionLevel);
    }

    const filteredOptions = usersOptions.filter(
      (option) =>
        !selectedCollabsMap.get(option.value) &&
        option.value !== selectedDocument.owner
    );

    return filteredOptions;
  }, [formCollabs, users, selectedDocument]);

  const {
    fields: collaborators,
    append,
    update,
    remove,
  } = useFieldArray({
    control: form.control,
    name: "collaborators",
  });

  const handleReset = useCallback(() => {
    form.reset({
      selectedParticipant: "",
      permissionLevel: "viewer",
      collaborators: selectedDocument.collaborators ?? [],
    });
  }, [form, selectedDocument]);

  const onSubmit = (values: ShareForm) => {
    shareDocument(values.collaborators);
  };

  const handleAddCollab = () => {
    const formValues = form.getValues();
    const { selectedParticipant, permissionLevel } = formValues;

    if (!selectedParticipant || !permissionLevel) {
      toast.error("Please select a participant and a permission");
    }

    append({
      userId: selectedParticipant,
      permissionLevel,
    } as ICollaborator);

    form.setValue("permissionLevel", TPermissionLevel.VIEWER);
    form.setValue("selectedParticipant", "");
  };

  const handleRemoveCollab = (index: number) => {
    remove(index);
  };

  useEffect(() => {
    handleReset();
  }, [handleReset]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent title="">
        <Form {...form}>
          <form id="share-form" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <h2 className="font-medium">Share with</h2>
              </div>
              <FormField
                control={form.control}
                name="selectedParticipant"
                render={({ field }) => (
                  <FormControl>
                    <UsersInput {...field} options={options} />
                  </FormControl>
                )}
              />
              <FormField
                control={form.control}
                name="permissionLevel"
                render={({ field }) => (
                  <FormControl>
                    <SelectInput options={permissionLevels} {...field} />
                  </FormControl>
                )}
              />
            </div>
            <div className="flex justify-end items-center gap-2 mt-4">
              <Button
                type="button"
                onClick={handleAddCollab}
                variant="secondary"
              >
                Add
              </Button>
            </div>
            <Separator className="mx-2 my-4 w-auto bg-sidebar-border" />
            <div className="flex flex-col gap-2">
              <h2 className="font-medium">Manage access</h2>
              <ul className="flex flex-col gap-2">
                {collaborators?.map((collab, index) => {
                  const user = usersMap.get(collab.userId);
                  return user ? (
                    <li key={collab.userId}>
                      <UserPermissionInput
                        collab={collab}
                        index={index}
                        control={form.control}
                        subtitle={user.email}
                        title={user.firstName}
                        update={update}
                        onDelete={handleRemoveCollab}
                        key={collab.userId}
                      />
                    </li>
                  ) : null;
                })}
              </ul>
            </div>
          </form>
        </Form>

        <DialogFooter className="mt-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            disabled={isLoading}
            size="sm"
            type="submit"
            form="share-form"
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDialog;
