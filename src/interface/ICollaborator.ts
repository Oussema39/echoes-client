import { TPermissionLevel } from "@/utils/constants";

export interface ICollaborator {
  userId: string;
  permissionLevel: `${TPermissionLevel}`;
}
