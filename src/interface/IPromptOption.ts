import { Button } from "@/components/ui/button";
import { TDocAIActions } from "@/utils/constants";
import { ComponentProps } from "react";

export interface IPromptOption {
  icon?: JSX.Element;
  label: string;
  color?: string;
  promptType: `${TDocAIActions}`;
  buttonProps?: ComponentProps<typeof Button>;
}
