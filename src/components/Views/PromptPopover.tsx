import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { FormProvider, useForm } from "react-hook-form";
import { FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Send } from "lucide-react";
import { PopoverPortal } from "@radix-ui/react-popover";

interface PromptPopoverProps extends React.PropsWithChildren {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSubmit?: (data: PromptFormValues) => void;
}

export interface PromptFormValues {
  prompt: string;
}

const PromptPopover = ({
  children,
  open,
  onOpenChange,
  onSubmit,
}: PromptPopoverProps) => {
  const form = useForm<PromptFormValues>({
    defaultValues: {
      prompt: "",
    },
  });

  const handleButtonClick = async () => {
    const isValid = await form.trigger();
    if (!isValid) return;

    const data = form.getValues();
    onSubmit?.(data);

    form.reset();
    onOpenChange?.(false);
  };

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverPortal>
        <PopoverContent className="w-96">
          <FormProvider {...form}>
            <div className="flex gap-1">
              <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Ask me anything..."
                        aria-label="prompt"
                        className="focus:outline-none focus:bg-muted/30 px-2 py-1 rounded bg-transparent"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="self-end"
                onClick={handleButtonClick}
              >
                <Send size={24} />
              </Button>
            </div>
          </FormProvider>
        </PopoverContent>
      </PopoverPortal>
    </Popover>
  );
};

export default PromptPopover;
