import { useMemo } from "react";
import { Autocomplete, AutocompleteMultiSelectProps } from "../ui/autocomplete";
import useUserQuery from "@/hooks/users/useUserQuery";

type UsersInputProps = {
  value: string | string[];
  onChange: (value: string | string[]) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filterOptions?: (autocompleteOptions: any[]) => any[];
} & Partial<AutocompleteMultiSelectProps>;

const UsersInput = ({
  value,
  onChange,
  filterOptions,
  ...props
}: UsersInputProps) => {
  const { users, isLoading } = useUserQuery();

  const options = useMemo(() => {
    const usersOptions = users?.map((user) => ({
      label: `${user.firstName} ${user.lastName}`,
      value: user._id,
    }));
    return filterOptions ? filterOptions(usersOptions) : usersOptions;
  }, [users, filterOptions]);

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
