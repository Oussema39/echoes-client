/* eslint-disable @typescript-eslint/no-explicit-any */
import { TPermissionLevel } from "@/utils/constants";
import SelectInput from "../form/SelectInput";
import { permissionLevels } from "@/utils/selectOptions";
import { FormField } from "../ui/form";
import { Control } from "react-hook-form";

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
};

const UserPermissionInput = ({
  title,
  subtitle,
  collab,
  control,
  index,
  update,
}: UserCardProps) => {
  return (
    <div className="flex justify-between" key={collab.id}>
      <div className="flex flex-col">
        <p className="text-sm">{title}</p>
        <p className="text-xs">{subtitle}</p>
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
