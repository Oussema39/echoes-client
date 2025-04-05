import { TPermissionLevel } from "./constants";

export const permissionLevels = [
  { value: TPermissionLevel.VIEWER, label: "Viewer" },
  { value: TPermissionLevel.EDITOR, label: "Editor" },
  { value: TPermissionLevel.MANAGER, label: "Manager" },
  { value: TPermissionLevel.OWNER, label: "Owner" },
];
