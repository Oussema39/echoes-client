/* eslint-disable @typescript-eslint/no-explicit-any */
import { TPermissionLevel } from "@/utils/constants";
import SelectInput from "../form/SelectInput";
import { permissionLevels } from "@/utils/selectOptions";
import { FormField } from "../ui/form";
import { Control } from "react-hook-form";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { useState } from "react";
import { TrashIcon } from "lucide-react";

type UserCardProps = {
  title: string;
  subtitle: string;
  collab: {
    id: string;
    permissionLevel: `${TPermissionLevel}`;
  };
  control: Control<any, any>;
  index: number;
  update: (index: number, data: any) => void;
  onDelete: (index: number) => void;
};

const UserPermissionInput = ({
  title,
  subtitle,
  collab,
  control,
  index,
  update,
  onDelete,
}: UserCardProps) => {
  const [isHovering, setIsHovering] = useState<boolean>(false);

  return (
    <div className="flex justify-between" key={collab.id}>
      <div className="flex items-center gap-3">
        {/* <Avatar>
          <AvatarFallback className="font-semibold bg-cyan-200/50 text-cyan-500">
            {title.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar> */}
        <div
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          className="relative group inline-flex items-center justify-center" // Added inline-flex for better alignment if needed
        >
          <Avatar>
            <AvatarFallback className="font-semibold bg-cyan-200/50 text-cyan-500 flex items-center justify-center w-10 h-10 rounded-full">
              {title.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {isHovering && (
            <div
              onClick={() => onDelete(index)}
              className="absolute inset-0 flex items-center justify-center bg-red-400/80 rounded-full cursor-pointer group-hover:opacity-100 transition-opacity duration-200"
            >
              <TrashIcon className="text-white h-5 w-5" />
            </div>
          )}
        </div>
        <div className="flex flex-col">
          <p className="text-sm">{title}</p>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
      </div>
      <div>
        <FormField
          control={control}
          name={`collaborators.${index}.permissionLevel`}
          render={({ field }) => {
            const onChange = (value: `${TPermissionLevel}`) => {
              field.onChange(value);
              update(index, {
                ...collab,
                permissionLevel: value,
              });
            };
            return (
              <SelectInput
                {...field}
                onChange={onChange}
                options={permissionLevels}
                defaultValue={collab.permissionLevel}
              />
            );
          }}
        />
      </div>
    </div>
  );
};

export default UserPermissionInput;
