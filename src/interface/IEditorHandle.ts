import { TDocAIActions } from "@/utils/constants";

export interface EditorHandle {
  applyAIAction: (action: `${TDocAIActions}`) => void;
}
