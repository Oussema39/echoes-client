import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Send } from "lucide-react";
import { useSocket } from "@/hooks/socket/useSocket";
import { EVENT_NAMES } from "@/utils/constants";
import { generateStructuredHtmlPrompt } from "@/utils/prompts";

interface PromptPopoverProps extends React.PropsWithChildren {
  onSubmit?: (data: PromptFormValues) => void;
}

export interface PromptFormValues {
  prompt: string;
}

const PromptChat = ({ onSubmit }: PromptPopoverProps) => {
  const { socket } = useSocket();
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

    socket.emit(EVENT_NAMES.CHAT_SEND, {
      prompt: generateStructuredHtmlPrompt(data.prompt, ""),
    });

    form.reset();
  };

  return (
    <FormProvider {...form}>
      <div className="flex flex-col gap-1">
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
          variant="default"
          size="sm"
          className="self-end"
          onClick={handleButtonClick}
        >
          Send
          <Send size={24} />
        </Button>
      </div>
    </FormProvider>
  );
};

export default PromptChat;
