import { TPermissionLevel } from "@/utils/constants";
import { IUser } from "./IUser";
import { IBase } from "./IBase";

type TCollaborator = {
  userId: string;
  permissionLevel: TPermissionLevel;
};

export interface IDocument extends IBase {
  title: string;
  content: string;
  owner: Partial<IUser>;
  collaborators: TCollaborator[];
  owned?: boolean;
  sharedWithMe?: boolean;
}
