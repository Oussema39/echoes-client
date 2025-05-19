import { useMemo } from "react";
import { Autocomplete, AutocompleteMultiSelectProps } from "../ui/autocomplete";
import useUserQuery from "@/hooks/users/useUserQuery";

type OptionType = {
  label: string;
  value: string;
};

type UsersInputProps = {
  value: string | string[];
  onChange: (value: string | string[]) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filterOptions?: (autocompleteOptions: OptionType[]) => OptionType[];
  options?: OptionType[];
} & Partial<AutocompleteMultiSelectProps>;

const UsersInput = ({
  value,
  onChange,
  filterOptions,
  options,
  ...props
}: UsersInputProps) => {
  const { users, isLoading } = useUserQuery();

  const autocompleteOptions = useMemo(() => {
    if (options) return options;
    const usersOptions = users?.map((user) => ({
      label: `${user.firstName} ${user.lastName}`,
      value: user._id,
    }));
    return filterOptions ? filterOptions(usersOptions) : usersOptions;
  }, [users, filterOptions, options]);

  return (
    <Autocomplete
      options={autocompleteOptions}
      onSelectionChange={onChange}
      selectedValues={value}
      placeholder="Search users..."
      loading={isLoading}
      {...props}
    />
  );
};

export default UsersInput;
