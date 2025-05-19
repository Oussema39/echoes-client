import { IBase } from "./IBase";

export interface IDocVersion extends IBase {
  documentId: string;
  changes: {
    title?: { oldValue: string; newValue: string };
    content?: { oldValue: string; newValue: string };
  };
  version?: number;
  timestamp: number;
  changedBy: string;
}
