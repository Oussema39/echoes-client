import { useMemo } from "react";
import { Autocomplete, AutocompleteMultiSelectProps } from "../ui/autocomplete";
import useUserQuery from "@/hooks/users/useUserQuery";

type UsersInputProps = {
  value: string | string[];
  onChange: (value: string | string[]) => void;
} & Partial<AutocompleteMultiSelectProps>;

const UsersInput = ({ value, onChange, ...props }: UsersInputProps) => {
  const { users, isLoading } = useUserQuery();

  const options = useMemo(() => {
    return users?.map((user) => ({
      label: `${user.firstName} ${user.lastName}`,
      value: user.email,
    }));
  }, [users]);

  return (
    <Autocomplete
      options={options}
      onSelectionChange={onChange}
      selectedValues={value}
      placeholder="Search users..."
      loading={isLoading}
      {...props}
    />
  );
};

export default UsersInput;
